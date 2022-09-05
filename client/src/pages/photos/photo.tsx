import { FC, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../components/templates/Layout';
import { isValidUUID } from '../../utils/validation';
import { NotFoundPage } from '../NotFound';
import useAxios from 'axios-hooks';
import { TabIsLoading } from '../../components/atoms/TabIsLoading';
import { Comment as IComment, Photo as IPhoto } from '../../interfaces/app';
import { formatDate } from '../../utils/formarDate';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';
import { useUserStore } from '../../stores/useUserStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/getErrorMessage';
import clsx from 'clsx';
import Rating from 'react-rating';
import { StarEmpty } from '../../components/atoms/StarEmpty';
import { StarFull } from '../../components/atoms/StarFull';

const LeaveComment: FC<{
	photoId: string;
	comments: IComment[];
	setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}> = ({ photoId, comments, setComments }) => {
	const [{ loading }, executeLeaveComment] = useAxios<
		{ status: boolean; success: boolean; comment: IComment },
		{ photoId: string; comment: string }
	>({ url: `/photos/${photoId}/comment`, method: 'POST' }, { manual: true });
	const name = useUserStore((s) => s.name);
	const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<{ comment: string }>();

	const onSubmit = handleSubmit(({ comment }) => {
		executeLeaveComment({
			data: {
				comment,
				photoId,
			},
		})
			.then((response) => {
				const { comment, success } = response.data;

				if (!success) return;

				setComments([...comments, comment]);
			})
			.then(() => {
				setValue('comment', '');
			})
			.catch((error) => {
				toast.error(getErrorMessage(error?.response?.data?.message));
			});
	});

	return (
		<article className="media">
			<figure className="media-left">
				<p className="image is-64x64">
					<img src={avatar} className="is-rounded" alt={name} />
				</p>
			</figure>
			<div className="media-content">
				<form onSubmit={onSubmit}>
					<div className="field">
						<p className="control">
							<textarea
								className="textarea"
								placeholder="Escribir un comentario..."
								{...register('comment', { required: true })}
							/>
							{errors.comment && (
								<strong style={{ color: 'red' }}>Ingresa un comentario</strong>
							)}
						</p>
					</div>
					<nav className="level">
						<div className="level-left">
							<div className="level-item">
								<button
									className={clsx('button is-primary', loading && 'is-loading')}
									type="submit"
								>
									Comentar
								</button>
							</div>
						</div>
					</nav>
				</form>
			</div>
		</article>
	);
};

const Comment: FC<IComment> = ({ comment, user, createdAt }) => {
	const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
		user.name
	)}`;

	return (
		<article className="media">
			<figure className="media-left">
				<Link to={`/users/${user.username}`} style={{ color: 'inherit' }}>
					<p className="image is-64x64">
						<img className="is-rounded" src={avatar} alt={user.name} />
					</p>
				</Link>
			</figure>
			<div className="media-content">
				<div className="content">
					<p>
						<Link to={`/users/${user.username}`} style={{ color: 'inherit' }}>
							<strong>{user.name}</strong> <small>@{user.username}</small>
						</Link>{' '}
						<small>{formatDate(createdAt)}</small>
						<br />
						{comment}
					</p>
				</div>
			</div>
			<div className="media-right"></div>
		</article>
	);
};

export const Photo: FC = () => {
	const [comments, setComments] = useState<IComment[]>([]);
	const isAuthenticated = useIsAuthenticated();
	const params = useParams();
	const photoId = params.id;
	const [{ data: createdRankingData }, executeCreateRanking] = useAxios<
		{ newRanking: number },
		{ photoId: string; rating: number }
	>(
		{
			method: 'POST',
			url: `/photos/${photoId}/rating`,
		},
		{
			manual: true,
		}
	);
	const [{ error, loading, data }] = useAxios<
		IPhoto & {
			comments: IComment[];
			user: { name: string; username: string };
			ranking: number;
		},
		any
	>(`/photos/${photoId}`);
	const [photoRanking, setPhotoRanking] = useState<number>(
		data?.ranking || createdRankingData?.newRanking || 0
	);

	const handleRatingChange = (n: number) => {
		executeCreateRanking({
			data: {
				photoId: photoId!,
				rating: n,
			},
		})
			.then((response) => {
				setPhotoRanking(response.data.newRanking);
			})
			.catch((error) => {
				console.log('error');
			});
	};

	useEffect(() => {
		if (!createdRankingData) return;

		setPhotoRanking(createdRankingData.newRanking);
	}, [createdRankingData]);

	useEffect(() => {
		if (!data) return;

		setComments([...comments, ...data.comments]);
	}, [data]);

	if (loading) {
		return (
			<div className="mt-6">
				<TabIsLoading />
			</div>
		);
	}

	if (!isValidUUID(photoId!) || error || !data) {
		return <NotFoundPage message="No se encontró la foto." />;
	}

	return (
		<Layout>
			<div className="container p-5">
				<div className="columns is-variable is-2">
					<div className="column is-8">
						<h1 className="title is-1">Foto: {data.title}</h1>

						<div className="card">
							<div className="card-image">
								<figure className="image is-16by9">
									<img src={data.url} alt={data.title} />
								</figure>
							</div>
							<div className="card-content">
								<div className="media">
									<div className="media-left">
										<figure className="image is-48x48">
											<img
												src="https://bulma.io/images/placeholders/96x96.png"
												alt="Placeholder image"
											/>
										</figure>
									</div>
									<div className="media-content">
										<p className="title is-4">{data.user.name}</p>
										<p className="subtitle is-6">@{data.user.username}</p>
									</div>
									<div className="media-right">
										{/** @ts-ignore */}
										<Rating
											key="dsalkdsakbdsajkdbasd"
											emptySymbol={<StarEmpty />}
											fullSymbol={<StarFull />}
											onChange={handleRatingChange}
											quiet
											initialRating={data.ranking || photoRanking}
											start={0}
											stop={5}
										/>
									</div>
								</div>

								<div className="content">
									{data.description}
									<br />
									<time dateTime={data.createdAt}>
										{formatDate(data.createdAt)}
									</time>
								</div>
							</div>
						</div>
					</div>
					<div className="column is-4">
						<h2 className="title is-1">Comentarios</h2>
						<div className="mb-6">
							{comments.length === 0 ? (
								<p>No hay comentarios disponibles.</p>
							) : (
								comments.map(
									({
										id,
										comment,
										createdAt,
										photoId,
										updatedAt,
										user,
										userId,
									}) => (
										<Comment
											key={id}
											id={id}
											comment={comment}
											createdAt={createdAt}
											photoId={photoId}
											updatedAt={updatedAt}
											user={user}
											userId={userId}
										/>
									)
								)
							)}
						</div>

						{isAuthenticated ? (
							<LeaveComment
								comments={comments}
								setComments={setComments}
								photoId={data.id}
							/>
						) : (
							<p>
								Para comentar por favor{' '}
								<strong>
									<Link to="/login">inicia sesión</Link>.
								</strong>
							</p>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};
