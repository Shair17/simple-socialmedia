import useAxios from 'axios-hooks';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FavoritePhotos } from '../../interfaces/app';
import { TabIsLoading } from '../atoms/TabIsLoading';

interface Props {
	username: string;
}

export const FavoritesTab: FC<Props> = ({ username }) => {
	const [{ error, loading, data }] = useAxios<FavoritePhotos[]>(
		`/users/${username}/favorites`
	);

	if (loading) return <TabIsLoading />;

	if (error || !data) {
		return (
			<p>
				{error?.response?.data.message || 'Ha ocurrido un error inesperado'}
			</p>
		);
	}

	if (data.length === 0) {
		return <p>@{username} no tiene fotos favoritas.</p>;
	}

	return (
		<div className="columns is-multiline is-mobile">
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
	);
};
