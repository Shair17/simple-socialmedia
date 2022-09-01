import jwtDecode from 'jwt-decode';

export const isTokenExpired = (token: string) => {
	return new Date(jwtDecode<{ exp: number }>(token).exp * 1000) < new Date();
};
