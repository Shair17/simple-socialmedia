import { User } from '../interfaces/app';

export type Tokens = {
	accessToken: string;
	refreshToken: string;
};

export const accessTokenKey = '@shair.project/token';
export const refreshTokenKey = '@shair.project/refresh-token';

export const userKey = '@shair.project/user';

export const user: User = {} as User;

export const accessToken = '';
export const refreshToken = '';
