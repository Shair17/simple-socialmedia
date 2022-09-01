import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { isTokenExpired } from '../services/refresh-token';
import { useAuthStore } from '../stores/useAuthStore';
import { isValidToken } from '../utils/isValidToken';

export const useShowSessionIsExpired = () => {
	const refreshToken = useAuthStore<string>((s) => s.refreshToken);

	useEffect(() => {
		if (!refreshToken) return;

		if (!isValidToken(refreshToken)) return;

		if (isTokenExpired(refreshToken)) {
			toast.error('Tu sesión ha expirado, por favor vuelve a iniciar sesión.');
		}
	}, [refreshToken]);
};
