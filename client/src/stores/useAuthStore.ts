import create from 'zustand';
import { combine } from 'zustand/middleware';
import {
	accessToken,
	refreshToken,
	accessTokenKey,
	refreshTokenKey,
	Tokens,
} from '../constants/auth';
import { http } from '../services/http';

export interface ITokens extends Tokens {}

type AuthType = Tokens;

const getDefaultValues = (): AuthType => {
	return {
		accessToken: localStorage.getItem(accessTokenKey) ?? accessToken,
		refreshToken: localStorage.getItem(refreshTokenKey) ?? refreshToken,
	};
};

export const useAuthStore = create(
	combine(getDefaultValues(), (set, get) => ({
		setAccessToken: (accessToken: string) => {
			localStorage.setItem(accessTokenKey, accessToken);

			set({
				accessToken,
			});
		},
		setRefreshToken: (refreshToken: string) => {
			localStorage.setItem(refreshTokenKey, refreshToken);

			set({
				refreshToken,
			});
		},
		setTokens: ({ accessToken, refreshToken }: Tokens) => {
			localStorage.setItem(accessTokenKey, accessToken);
			localStorage.setItem(refreshTokenKey, refreshToken);

			set({
				accessToken,
				refreshToken,
			});
		},
		removeTokens: () => {
			localStorage.removeItem(accessTokenKey);
			localStorage.removeItem(refreshTokenKey);

			set({
				accessToken: '',
				refreshToken: '',
			});
		},
		logOutFromServer: async () => {
			await http.post('/auth/logout');
		},
	}))
);
