import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../atoms/Avatar';

interface Props {
	id: string;
	name: string;
	username: string;
	description?: string;
	photosCount: number;
}

export const FeedUser: FC<PropsWithChildren<Props>> = ({
	id,
	name,
	username,
	description,
	photosCount,
}) => {
	return (
		<div className="mb-6">
			<Link to={`/users/${username}`} style={{ color: 'inherit' }}>
				<article className="media">
					<figure className="media-left">
						<Avatar name={name} />
					</figure>
					<div className="media-content">
						<div className="content">
							<p>
								<strong>{name}</strong> <small>@{username}</small>
							</p>
							<p className="m-0 truncate">{`${
								description || `@${username} no tiene una descripción`
							}`}</p>
							<p className="mt-2">Fotos: {photosCount}</p>
						</div>
					</div>
				</article>
			</Link>
		</div>
	);
};
