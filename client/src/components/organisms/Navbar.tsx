import { FC } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';
import clsx from 'clsx';
import { useUserStore } from '../../stores/useUserStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const Navbar: FC = () => {
	const isAuthenticated = useIsAuthenticated();
	const name = useUserStore((s) => s.name);
	const username = useUserStore((s) => s.username);
	const removeTokens = useAuthStore((s) => s.removeTokens);
	const logOutFromServer = useAuthStore((s) => s.logOutFromServer);
	const navigate = useNavigate();

	const logOut = async (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		event.preventDefault();
		logOutFromServer()
			.then(() => removeTokens())
			.then(() => navigate('/login', { replace: true }));
	};

	return (
		<nav
			className="navbar container"
			role="navigation"
			aria-label="main navigation"
		>
			<div className="navbar-brand">
				<NavLink to="/" className="navbar-item">
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
						width="50"
					/>
					<strong>Red Social</strong>
				</NavLink>

				<a
					role="button"
					className="navbar-burger"
					aria-label="menu"
					aria-expanded="false"
					data-target="navbarBasicExample"
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>

			<div id="navbarBasicExample" className="navbar-menu">
				<div className="navbar-start">
					<NavLink
						to="/users"
						className={({ isActive }) =>
							clsx('navbar-item', isActive && 'is-active')
						}
					>
						Usuarios
					</NavLink>
					<NavLink
						to="/photos"
						className={({ isActive }) =>
							clsx('navbar-item', isActive && 'is-active')
						}
					>
						Fotos
					</NavLink>
					{/* <NavLink
						to="/gallery"
						className={({ isActive }) =>
							clsx('navbar-item', isActive && 'is-active')
						}
					>
						Galerías
					</NavLink> */}
				</div>

				<div className="navbar-end">
					{isAuthenticated ? (
						<div className="navbar-item has-dropdown is-hoverable">
							<Link to={`/users/${username}`} className="navbar-link">
								<p className="image">
									<img
										className="is-rounded"
										src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
											name
										)}`}
										alt={name}
									/>
								</p>
								<strong className="ml-2">{name}</strong>
							</Link>

							<div className="navbar-dropdown">
								<Link to={`/users/${username}`} className="navbar-item">
									Mi Perfil
								</Link>
								<Link to="/upload" className="navbar-item">
									Subir Foto
								</Link>
								{/* <Link to="/new" className="navbar-item">
									Crear Galería
								</Link> */}
								<hr className="navbar-divider" />
								<a className="navbar-item" onClick={logOut}>
									Cerrar Sesión
								</a>
							</div>
						</div>
					) : (
						<div className="navbar-item">
							<div className="buttons">
								<Link to="/register" className="button is-primary">
									<strong>Registrarse</strong>
								</Link>
								<Link to="/login" className="button is-light">
									Iniciar Sesión
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};
