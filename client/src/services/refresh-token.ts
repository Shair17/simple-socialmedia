import jwtDecode from 'jwt-decode';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore, ITokens } from '../stores/useAuthStore';
import { isValidToken } from '../utils/isValidToken';

// a little time before expiration to try refresh (seconds)
const EXPIRE_FUDGE = 10;

type Token = string;

export const isLoggedIn = (): boolean => {
	const refreshToken = getRefreshToken();

	if (!refreshToken) {
		return false;
	}

	if (!isValidToken(refreshToken)) {
		return false;
	}

	if (isTokenExpired(refreshToken)) {
		clearAuthTokens();
		return false;
	}

	return !!refreshToken;
};

export const setAuthTokens = (tokens: ITokens): void =>
	useAuthStore.setState(tokens);

export const setAccessToken = (token: Token): void => {
	const tokens = getAuthTokens();

	if (!tokens) {
		throw new Error(
			'Unable to update access token since there are not tokens currently stored'
		);
	}

	tokens.accessToken = token;
	setAuthTokens(tokens);
};

export const clearAuthTokens = (): void =>
	useAuthStore.getState().removeTokens();

export const getRefreshToken = (): Token | undefined => {
	const tokens = getAuthTokens();
	return tokens ? tokens.refreshToken : undefined;
};

export const getAccessToken = (): Token | undefined => {
	const tokens = getAuthTokens();
	return tokens ? tokens.accessToken : undefined;
};

export const refreshTokenIfNeeded = async (
	requestRefresh: TokenRefreshRequest
): Promise<Token | undefined> => {
	// use access token (if we have it)
	let accessToken = getAccessToken();

	// check if access token is expired
	if (!accessToken || isTokenExpired(accessToken)) {
		// do refresh

		accessToken = await refreshToken(requestRefresh);
	}

	return accessToken;
};

export const applyAuthTokenInterceptor = (
	axios: AxiosInstance,
	config: IAuthTokenInterceptorConfig
): void => {
	if (!axios.interceptors) throw new Error(`invalid axios instance: ${axios}`);
	axios.interceptors.request.use(authTokenInterceptor(config));
};

// export const useAuthTokenInterceptor = applyAuthTokenInterceptor;

const getAuthTokens = (): ITokens | undefined => {
	const accessToken = useAuthStore.getState().accessToken;
	const refreshToken = useAuthStore.getState().refreshToken;

	if (!accessToken && !refreshToken) return;

	return {
		accessToken,
		refreshToken,
	};
};

export const isTokenExpired = (token: Token): boolean => {
	if (!token) return true;
	const expiresIn = getExpiresIn(token);
	return !expiresIn || expiresIn <= EXPIRE_FUDGE;
};

const getTimestampFromToken = (token: Token): number | undefined => {
	const decoded = jwtDecode<{ [key: string]: number }>(token);

	return decoded?.exp;
};

const getExpiresIn = (token: Token): number => {
	const expiration = getTimestampFromToken(token);

	if (!expiration) return -1;

	return expiration - Date.now() / 1000;
};

const refreshToken = async (
	requestRefresh: TokenRefreshRequest
): Promise<Token> => {
	const refreshToken = getRefreshToken();
	if (!refreshToken) throw new Error('No refresh token available');

	try {
		isRefreshing = true;

		// Refresh and store access token using the supplied refresh function
		const newTokens = await requestRefresh(refreshToken);
		if (typeof newTokens === 'object' && newTokens?.accessToken) {
			setAuthTokens(newTokens);
			return newTokens.accessToken;
		} else if (typeof newTokens === 'string') {
			setAccessToken(newTokens);
			return newTokens;
		}

		throw new Error(
			'requestRefresh must either return a string or an object with an accessToken'
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// Failed to refresh token
		const status = error?.response?.status;
		if (status === 401 || status === 422) {
			// The refresh token is invalid so remove the stored tokens

			useAuthStore.getState().removeTokens();

			throw new Error(
				`Got ${status} on token refresh; clearing both auth tokens`
			);
		} else {
			// A different error, probably network error
			throw new Error(`Failed to refresh auth token: ${error.message}`);
		}
	} finally {
		isRefreshing = false;
	}
};

export type TokenRefreshRequest = (
	refreshToken: Token
) => Promise<Token | ITokens>;

export interface IAuthTokenInterceptorConfig {
	header?: string;
	headerPrefix?: string;
	requestRefresh: TokenRefreshRequest;
}

export const authTokenInterceptor =
	({
		header = 'Authorization',
		headerPrefix = 'Bearer ',
		requestRefresh,
	}: IAuthTokenInterceptorConfig) =>
	async (requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
		// We need refresh token to do any authenticated requests
		if (!getRefreshToken()) return requestConfig;

		// Queue the request if another refresh request is currently happening
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				queue.push({ resolve, reject });
			})
				.then((token) => {
					if (requestConfig.headers) {
						requestConfig.headers[header] = `${headerPrefix}${token}`;
					}
					return requestConfig;
				})
				.catch(Promise.reject);
		}

		// Do refresh if needed
		let accessToken;
		try {
			accessToken = await refreshTokenIfNeeded(requestRefresh);
			resolveQueue(accessToken);
		} catch (error: unknown) {
			if (error instanceof Error) {
				declineQueue(error);
				throw new Error(
					`Unable to refresh access token for request due to token refresh error: ${error.message}`
				);
			}
		}

		// add token to headers
		if (accessToken && requestConfig.headers)
			requestConfig.headers[header] = `${headerPrefix}${accessToken}`;
		return requestConfig;
	};

type RequestsQueue = {
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}[];

let isRefreshing = false;
let queue: RequestsQueue = [];

const resolveQueue = (token?: Token) => {
	queue.forEach((p) => {
		p.resolve(token);
	});

	queue = [];
};

const declineQueue = (error: Error) => {
	queue.forEach((p) => {
		p.reject(error);
	});

	queue = [];
};
