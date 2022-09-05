import { FC, PropsWithChildren } from 'react';
import { Layout } from '../../components/templates/Layout';
import useAxios from 'axios-hooks';
import { Link } from 'react-router-dom';
import { User } from '../../interfaces/app';
import { formatDate } from '../../utils/formarDate';
import { useUserStore } from '../../stores/useUserStore';
import { TabIsLoading } from '../../components/atoms/TabIsLoading';

export const UsersPage: FC<PropsWithChildren<{}>> = () => {
	const [{ error, loading, data }] = useAxios<User[]>('/users');
	const myUsername = useUserStore((s) => s.username);

	if (loading)
		return (
			<div className="mt-6">
				<TabIsLoading />
			</div>
		);

	if (error || !data) {
		return (
			<Layout>
				<div className="container is-max-widescreen p-5">
					<p>Ha ocurrido un error inesperado.</p>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="container is-max-widescreen p-5">
				<h1 className="title is-1">Usuarios en Red Social</h1>
				<div className="columns is-multiline is-desktop">
					{data.map(
						({
							id,
							username,
							address,
							birthDate,
							createdAt,
							email,
							favorites,
							favoritesCount,
							favoritesPrivate,
							gallery,
							galleryCount,
							name,
							photos,
							photosCount,
							updatedAt,
							description,
						}) => {
							const ItsMe = username === myUsername;
							const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
								name
							)}`;

							return (
								<div className="column is-one-third" key={id}>
									<Link to={`/users/${username}`} style={{ color: 'inherit' }}>
										<div className="card">
											<div className="card-content">
												<div className="media">
													<div className="media-left">
														<figure className="image is-48x48">
															<img src={avatar} alt={name} />
														</figure>
													</div>
													<div className="media-content">
														<p className="title is-4">{name}</p>
														<p className="subtitle is-6">@{username}</p>
													</div>
												</div>

												<div className="content">
													{description ||
														`${
															ItsMe
																? 'No tienes descripción.'
																: `@${username} no tiene una descripción.`
														}`}
													<br />
													<br />
													<time dateTime="2016-1-1">
														{`${
															ItsMe ? 'Te has unido' : 'Se ha unido'
														} ${formatDate(createdAt)}.`}
													</time>
												</div>
											</div>
										</div>
									</Link>
								</div>
							);
						}
					)}
				</div>
			</div>
		</Layout>
	);
};
