import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/templates/Layout';
import { isValidUsername } from '../../utils/validation';
import { NotFoundPage } from '../NotFound';
import useAxios from 'axios-hooks';
import { GetUserByUsernameResponse } from '../../interfaces/app';
import { useUserStore } from '../../stores/useUserStore';
import { formatDate } from '../../utils/formarDate';
import { normalizeDate } from '../../utils/normalizeDate';
import { calcAgeFromDate } from '../../utils/calcAgeFromDate';
import { PhotosTab } from '../../components/organisms/PhotosTab';
import { GalleryTab } from '../../components/organisms/GalleryTab';
import { FavoritesTab } from '../../components/organisms/FavoritesTab';
import clsx from 'clsx';
import { TabIsLoading } from '../../components/atoms/TabIsLoading';

export const User: FC = () => {
	const [tab, setTab] = useState<'photos' | 'gallery' | 'favorites'>('photos');
	const params = useParams();
	const username = params.username;
	const [{ error, loading, data }] = useAxios<GetUserByUsernameResponse>({
		url: `/users/${username}`,
	});
	const myUsername = useUserStore((u) => u.username);
	const ItsMe = data?.username === myUsername;

	if (loading) {
		return (
			<div className="mt-6">
				<TabIsLoading />
			</div>
		);
	}

	if (!isValidUsername(username!) || error || !data) {
		return <NotFoundPage message={`No se encontró al usuario @${username}.`} />;
	}

	return (
		<Layout>
			<div className="container is-max-desktop p-5">
				<div className="columns">
					<div className="column is-one-third">
						<div className="is-justify-content-center p-5">
							<figure
								className="image is-128x128"
								style={{ marginLeft: 'auto', marginRight: 'auto' }}
							>
								<img
									className="is-rounded"
									src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
										data.name
									)}`}
								/>
							</figure>
						</div>
					</div>
					<div className="column">
						<article className="media">
							<div className="media-left"></div>
							<div className="media-content">
								<div className="content">
									<h1 className="title">{data.name}</h1>
									<h2 className="subtitle is-3">@{data.username}</h2>
									<h3 className="subtitle is-6">
										{`${ItsMe ? 'Te has unido' : 'Se ha unido'} ${formatDate(
											data.createdAt
										)}.`}
									</h3>
									<h4 className="subtitle is-6">
										Fecha de Nacimiento:{' '}
										{normalizeDate(new Date(data.birthDate))}
									</h4>
									<h5 className="subtitle is-6">
										Edad: {calcAgeFromDate(new Date(data.birthDate))} años
									</h5>
									<p>Dirección: {data.address}</p>
									<br />
									{data.description
										? data.description
										: `${data.name} (@${data.username}) no tiene una descripción.`}
								</div>
							</div>
							<div className="media-right"></div>
						</article>
					</div>
				</div>

				<br />

				<div className="tabs">
					<ul>
						<li className={clsx(tab === 'photos' && 'is-active')}>
							<a onClick={() => setTab('photos')}>Fotos: {data.photosCount}</a>
						</li>
						<li className={clsx(tab === 'gallery' && 'is-active')}>
							<a onClick={() => setTab('gallery')}>
								Galerías: {data.galleryCount}
							</a>
						</li>
						<li className={clsx(tab === 'favorites' && 'is-active')}>
							<a onClick={() => setTab('favorites')}>
								Favoritos: {data.favoritesCount}
							</a>
						</li>
					</ul>
				</div>

				<br />

				{tab === 'photos' ? (
					<PhotosTab ItsMe={ItsMe} username={data.username} />
				) : tab === 'gallery' ? (
					<GalleryTab ItsMe={ItsMe} username={data.username} />
				) : tab === 'favorites' ? (
					<FavoritesTab username={data.username} />
				) : (
					<p>No hay contenido para mostrar.</p>
				)}
			</div>
		</Layout>
	);
};
