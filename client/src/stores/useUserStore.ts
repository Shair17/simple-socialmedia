import create from 'zustand';
import { combine } from 'zustand/middleware';
import { User } from '../interfaces/app';
import { http } from '../services/http';
import { isLoggedIn } from '../services/refresh-token';

const getDefaultValues = async (): Promise<User> => {
	const isAuthenticated = isLoggedIn();

	if (!isAuthenticated) {
		return {} as User;
	}

	const response = await http.get<User>('/users/me');

	return response.data;
};

export const useUserStore = create(
	combine(await getDefaultValues(), (set, get) => ({
		fetchUser: async () => {
			const isAuthenticated = isLoggedIn();

			if (!isAuthenticated) {
				return {} as User;
			}

			const response = await http.get<User>('/users/me');

			set(response.data);
		},
		setUser: (user: User) => set(user),
	}))
);
