import { FC } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/templates/AuthLayout';
import { useAuthStore } from '../stores/useAuthStore';
import { useUserStore } from '../stores/useUserStore';
import { useForm } from 'react-hook-form';
import { USERNAME_REGEX, PASSWORD_REGEX } from '../constants/regex';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import useAxios from 'axios-hooks';
import { LoginBody, LoginResponse, LoginType } from '../interfaces/app';
import { getLoginErrorMessage } from '../utils/getErrorMessage';

export const LoginPage: FC = () => {
	const [{ loading }, executeLoginUser] = useAxios<LoginResponse, LoginBody>(
		{
			url: '/auth/login',
			method: 'POST',
		},
		{ manual: true }
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginType>();
	const setTokens = useAuthStore((s) => s.setTokens);
	const setUser = useUserStore((u) => u.setUser);
	const navigate = useNavigate();
	const location = useLocation();

	// @ts-ignore
	const from: string = location.state?.from?.pathname || '/';

	const onSubmit = handleSubmit(({ username, password }) => {
		executeLoginUser({
			data: {
				username,
				password,
			},
		})
			.then((response) => {
				const { accessToken, refreshToken, user } = response.data;

				setTokens({
					accessToken,
					refreshToken,
				});
				setUser(user);
			})
			.then(() => {
				navigate(from, { replace: true });
			})
			.catch((error) => {
				toast.error(getLoginErrorMessage(error?.response?.data?.message));
			});
	});

	return (
		<AuthLayout
			title="Iniciar Sesión"
			description="Por favor ingresa tus datos para iniciar sesión."
			footer={<Link to="/register">Registrarse</Link>}
		>
			<form onSubmit={onSubmit}>
				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="text"
							placeholder="Nombre de Usuario"
							{...register('username', {
								required: true,
								pattern: USERNAME_REGEX,
							})}
						/>
						{errors.username && (
							<strong style={{ color: 'red' }}>
								Introduce un nombre de usuario correcto.
							</strong>
						)}
					</div>
				</div>

				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="password"
							placeholder="Contraseña"
							{...register('password', {
								required: true,
								pattern: PASSWORD_REGEX,
							})}
						/>
						{errors.password && (
							<strong style={{ color: 'red' }}>
								Contraseña inválida, mínimo ocho caracteres, al menos una letra
								mayúscula, una letra minúscula, un número y un carácter
								especial.
							</strong>
						)}
					</div>
				</div>
				<button
					className={clsx(
						'button is-block is-primary mt-5 is-medium is-fullwidth',
						loading && 'is-loading'
					)}
				>
					Iniciar Sesión
				</button>
			</form>
		</AuthLayout>
	);
};
