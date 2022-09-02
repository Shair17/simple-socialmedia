const FALLBACK_MESSAGE = 'Ha ocurrido un error inesperado.';

export const getErrorMessage = (message: string) => {
	return {}[message] || message || FALLBACK_MESSAGE;
};

export const getLoginErrorMessage = (message: string) => {
	return (
		{
			invalid_credentials: 'Nombre de usuario y/o contraseña incorrectos.',
			'Rate limit exceeded, retry in 1 minute':
				'Límite excedido, intentalo en 1 minuto porfavor.',
		}[message] ||
		message ||
		FALLBACK_MESSAGE
	);
};

export const getRegisterErrorMessage = (message: string) => {
	return (
		{
			account_taken: 'Prueba con otros datos por favor.',
			'Rate limit exceeded, retry in 1 minute':
				'Límite excedido, intentalo en 1 minuto porfavor.',
		}[message] ||
		message ||
		FALLBACK_MESSAGE
	);
};
