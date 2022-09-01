import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formarDate';
import { Photo } from '../../interfaces/app';

interface Props {
	id: string;
	name: string;
	username: string;
	filename: string;
	imageUrl: string;
	title: string;
	description: string;
	score: number;
	createdAt: string;
}

export const FeedPhoto: FC<PropsWithChildren<Props>> = ({
	id,
	name,
	username,
	filename,
	imageUrl,
	title,
	description,
	score,
	createdAt,
}) => {
	const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

	return (
		<Link to={`/photos/${id}`}>
			<div className="card">
				<div className="card-image">
					<figure className="image is-16by9">
						<img src={imageUrl} alt={title} />
					</figure>
				</div>
				<div className="card-content">
					<p className="subtitle is-7">
						{filename} - {title}
					</p>
					<div className="media">
						<div className="media-left">
							<figure className="image is-48x48">
								<img className="is-rounded" src={avatar} alt={name} />
							</figure>
						</div>
						<div className="media-content">
							<p className="title is-4">{name}</p>
							<p className="subtitle is-6">@{username}</p>
						</div>
						<div className="media-right">Calificacion: {score}</div>
					</div>

					<div className="content">
						{description}
						<br />
						<time dateTime={createdAt} title={createdAt}>
							{formatDate(createdAt)}
						</time>
					</div>
				</div>
			</div>
		</Link>
	);
};
