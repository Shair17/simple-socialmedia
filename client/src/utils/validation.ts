import {
	EMAIL_REGEX,
	PASSWORD_REGEX,
	USERNAME_REGEX,
	UUID_REGEX,
	DNI_REGEX,
} from '../constants/regex';

export const isValidUsername = (username: string) => {
	return USERNAME_REGEX.test(username);
};

export const isValidUUID = (uuid: string) => {
	return UUID_REGEX.test(uuid);
};

export const isValidPassword = (password: string) => {
	return PASSWORD_REGEX.test(password);
};

export const isValidEmail = (email: string) => {
	return EMAIL_REGEX.test(email);
};

export const isValidDNI = (dni: string) => {
	return DNI_REGEX.test(dni);
};
