import { FC } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useUserStore } from '../stores/useUserStore';
import { AuthLayout } from '../components/templates/AuthLayout';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import {
	USERNAME_REGEX,
	EMAIL_REGEX,
	PASSWORD_REGEX,
} from '../constants/regex';
import useAxios from 'axios-hooks';
import {
	RegisterBody,
	RegisterResponse,
	RegisterType,
} from '../interfaces/app';
import { getRegisterErrorMessage } from '../utils/getErrorMessage';
import { toast } from 'react-hot-toast';

export const RegisterPage: FC = () => {
	const [{ loading }, executeRegisterUser] = useAxios<
		RegisterResponse,
		RegisterBody
	>(
		{
			url: '/auth/register',
			method: 'POST',
		},
		{ manual: true }
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterType>();
	const setTokens = useAuthStore((s) => s.setTokens);
	const setUser = useUserStore((u) => u.setUser);
	const navigate = useNavigate();
	const location = useLocation();

	// @ts-ignore
	const from: string = location.state?.from?.pathname || '/';

	const onSubmit = handleSubmit(
		({ address, birthDate, email, name, password, username }) => {
			executeRegisterUser({
				data: {
					address,
					birthDate: new Date(birthDate).toISOString(),
					email,
					name,
					password,
					username,
				},
			})
				.then((response) => {
					const { accessToken, refreshToken, user } = response.data;

					setTokens({
						accessToken,
						refreshToken,
					});
					setUser(user);

					console.log({
						accessToken,
						refreshToken,
						user,
					});
				})
				.then(() => {
					navigate(from, { replace: true });
				})
				.catch((error) => {
					toast.error(getRegisterErrorMessage(error?.response?.data?.message));
				});
		}
	);

	return (
		<AuthLayout
			title="Registrarse"
			description="Por favor ingresa tus datos para crear una cuenta."
			footer={<Link to="/login">Iniciar Sesi??n</Link>}
		>
			<form onSubmit={onSubmit}>
				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="text"
							placeholder="Tus nombre(s) y apellidos"
							{...register('name', {
								required: true,
							})}
						/>
						{errors.name && (
							<strong style={{ color: 'red' }}>
								Ingresa tus nombre(s) y apellidos por favor.
							</strong>
						)}
					</div>
				</div>

				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="text"
							placeholder="Tu nombre de usuario"
							{...register('username', {
								required: true,
								pattern: USERNAME_REGEX,
							})}
						/>
						{errors.username && (
							<strong style={{ color: 'red' }}>
								Nombre de usuario invalido. Se permiten caracteres alfanum??rica
								que puede incluir _ y - con una longitud de 3 a 16 caracteres.
							</strong>
						)}
					</div>
				</div>

				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="email"
							placeholder="Tu correo electr??nico"
							{...register('email', {
								required: true,
								pattern: EMAIL_REGEX,
							})}
						/>
						{errors.email && (
							<strong style={{ color: 'red' }}>
								Ingresa un correo electr??nico valido.
							</strong>
						)}
					</div>
				</div>

				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="password"
							placeholder="Tu contrase??a"
							{...register('password', {
								required: true,
								pattern: PASSWORD_REGEX,
							})}
						/>
						{errors.password && (
							<strong style={{ color: 'red' }}>
								Contrase??a inv??lida, m??nimo ocho caracteres, al menos una letra
								may??scula, una letra min??scula, un n??mero y un car??cter
								especial.
							</strong>
						)}
					</div>
				</div>

				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="text"
							placeholder="Tu direcci??n"
							{...register('address', {
								required: true,
							})}
						/>
						{errors.address && (
							<strong style={{ color: 'red' }}>
								Ingresa una direcci??n valida.
							</strong>
						)}
					</div>
				</div>

				<div className="field">
					<div className="control">
						<input
							className="input is-medium"
							type="date"
							placeholder="Tu direcci??n"
							{...register('birthDate', {
								required: true,
							})}
						/>
						{errors.birthDate && (
							<strong style={{ color: 'red' }}>
								Ingresa una fecha de nacimiento
							</strong>
						)}
					</div>
				</div>

				<button
					className={clsx(
						'button is-block is-primary is-medium mt-5 is-fullwidth',
						loading && 'is-loading'
					)}
				>
					Registrarse
				</button>
			</form>
		</AuthLayout>
	);
};
