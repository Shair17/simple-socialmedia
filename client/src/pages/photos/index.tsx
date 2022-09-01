import { FC, PropsWithChildren } from 'react';
import { Layout } from '../../components/templates/Layout';
import useAxios from 'axios-hooks';
import { FeedPhoto } from '../../components/organisms/FeedPhoto';
import { TabIsLoading } from '../../components/atoms/TabIsLoading';

interface GetPhotoResponse {
	user: {
		name: string;
		username: string;
	};
	score: number;
	id: string;
	filename: string;
	title: string;
	description: string;
	url: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	photoGalleryId: string;
}

export const PhotosPage: FC<PropsWithChildren<{}>> = () => {
	const [{ error, loading, data }] = useAxios<GetPhotoResponse[]>('/photos');

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
				<h1 className="title is-1">Fotos en Red Social</h1>
				<div className="columns is-multiline is-mobile">
					{data.length === 0 && (
						<p className="subtitle ml-4">No hay fotos aún.</p>
					)}
					{data.map(
						({
							createdAt,
							description,
							filename,
							id,
							title,
							updatedAt,
							url,
							userId,
							photoGalleryId,
							user: { name, username },
							score,
						}) => {
							return (
								<div className="column is-one-third" key={id}>
									<FeedPhoto
										id={id}
										filename={filename}
										title={title}
										imageUrl={url}
										name={name}
										score={score}
										username={username}
										description={description}
										createdAt={createdAt}
									/>
								</div>
							);
						}
					)}
				</div>
			</div>
		</Layout>
	);
};
