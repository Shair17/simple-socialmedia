import { FC } from 'react';
import { FeedPhoto } from '../components/organisms/FeedPhoto';
import { Layout } from '../components/templates/Layout';
import { useDate } from '../hooks/useDate';
import { useUserStore } from '../stores/useUserStore';
import { Loader } from '../components/atoms/Loader';
import { TabIsLoading } from '../components/atoms/TabIsLoading';
import { UsersTop } from '../components/organisms/UsersTop';
import useAxios from 'axios-hooks';
import { GetPhotosFeed } from '../interfaces/app';

const FeedPhotosPosts = () => {
	const [{ data, loading, error }] = useAxios<GetPhotosFeed[]>(
		`/feed/photos?take=100&skip=0&orderBy=desc`
	);

	if (loading) return <TabIsLoading />;

	if (error || !data) {
		return <p>Error al cargar el feed.</p>;
	}

	if (data.length === 0) {
		return <p>No hay datos.</p>;
	}

	/* <Loader /> */

	return (
		<>
			{data.map(
				({
					id,
					url,
					createdAt,
					title,
					description,
					filename,
					user,
					ranking,
				}) => (
					<div className="mb-6" key={id}>
						<FeedPhoto
							id={id}
							imageUrl={url}
							createdAt={createdAt}
							description={description}
							filename={filename}
							name={user!.name}
							score={ranking}
							title={title}
							username={user!.username}
						/>
					</div>
				)
			)}
		</>
	);
};

export const IndexPage: FC = () => {
	const name = useUserStore((s) => s.name);
	const { greeting } = useDate();
	const greetingMessage = name ? `${greeting}, ${name}` : greeting;

	return (
		<Layout>
			<div className="container is-max-widescreen p-5">
				<div className="columns is-variable is-5">
					<div className="column is-8">
						<h1 className="title is-4">{greetingMessage}</h1>
						<br />

						<FeedPhotosPosts />

						<br />
						<br />
						<br />
					</div>
					<div className="column is-4">
						<h2 className="title is-4">Top de Usuarios</h2>
						<br />

						<UsersTop />
					</div>
				</div>
			</div>
		</Layout>
	);
};
