import { JWT_REGEX } from '../constants/regex';

export const isValidToken = (token: string) => {
	return token.split('.').length === 3 && JWT_REGEX.test(token);
};
