import { FC } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../atoms/PlusIcon';
import useAxios from 'axios-hooks';
import { TabIsLoading } from '../atoms/TabIsLoading';
import { Photo } from '../../interfaces/app';

interface Props {
	ItsMe: boolean;
	username: string;
}

export const PhotosTab: FC<Props> = ({ ItsMe, username }) => {
	const [{ error, loading, data }] = useAxios<Photo[]>(
		`/users/${username}/photos`
	);

	if (loading) return <TabIsLoading />;

	if (error || !data) {
		return <p>Ha ocurrido un error inesperado</p>;
	}

	return (
		<>
			{data.length === 0 && <p className="mb-5">@{username} no tiene fotos.</p>}
			<div className="columns is-multiline is-desktop">
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
								<strong className="ml-1">Subir una Foto</strong>
							</div>
						</Link>
					</div>
				)}

				{data.map(({ id, url }) => (
					<div className="column is-one-third" key={id}>
						<Link to={`/photos/${id}`} style={{ color: 'inherit' }}>
							<figure className="image is-square">
								<img src={url} className="img-fluid" />
							</figure>
						</Link>
					</div>
				))}
			</div>
		</>
	);
};
