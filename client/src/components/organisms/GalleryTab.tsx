import { FC } from 'react';
import useAxios from 'axios-hooks';
import { TabIsLoading } from '../atoms/TabIsLoading';
import { PhotoGallery } from '../../interfaces/app';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../atoms/PlusIcon';

interface Props {
	ItsMe: boolean;
	username: string;
}

export const GalleryTab: FC<Props> = ({ ItsMe, username }) => {
	const [{ error, loading, data }] = useAxios<PhotoGallery[]>(
		`/users/${username}/gallery`
	);

	if (loading) return <TabIsLoading />;

	if (error || !data) {
		return <p>Ha ocurrido un error inesperado</p>;
	}

	return (
		<>
			{data.length === 0 && (
				<p className="mb-5">@{username} no tiene galerías.</p>
			)}
			<div className="columns is-multiline is-mobile">
				{ItsMe && (
					<div className="column is-one-third">
						<Link to="/upload" style={{ color: 'inherit' }}>
							<div
								className="is-flex is-justify-content-center is-align-items-center p-5"
								style={{
									width: '100%',
									height: '100%',
									background: 'rgba(0,0,0,0.1)',
								}}
							>
								<PlusIcon />
								<strong className="ml-1">Crear una Galería</strong>
							</div>
						</Link>
					</div>
				)}

				{data.map((_, key) => (
					<div className="column is-one-third" key={key}>
						<Link key={key} to={`/photos/${key}`} style={{ color: 'inherit' }}>
							<figure className="image is-square">
								<img src="https://bulma.io/images/placeholders/256x256.png" />
							</figure>
						</Link>
					</div>
				))}
			</div>
		</>
	);
};
