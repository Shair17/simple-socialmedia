import { FC } from 'react';
import { FeedPhoto } from '../components/organisms/FeedPhoto';
import { Layout } from '../components/templates/Layout';
import { useDate } from '../hooks/useDate';
import { useUserStore } from '../stores/useUserStore';
import { Loader } from '../components/atoms/Loader';
import { TabIsLoading } from '../components/atoms/TabIsLoading';
import { UsersTop } from '../components/organisms/UsersTop';

export const IndexPage: FC = () => {
	const name = useUserStore((s) => s.name);
	const { greeting } = useDate();
	const greetingMessage = name ? `${greeting}, ${name}` : greeting;

	// aquí poner fotos de todos y cosas así...

	return (
		<Layout>
			<div className="container is-max-widescreen p-5">
				<div className="columns is-variable is-5">
					<div className="column is-8">
						<h1 className="title is-4">{greetingMessage}</h1>
						<br />

						<TabIsLoading />

						{/** iterar */}
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, key) => (
							<div className="mb-6" key={key}>
								<FeedPhoto
									id="123"
									imageUrl="https://i.imgur.com/91DjRrU.png"
									createdAt={new Date().toISOString()}
									description="Hola, esta es mi primera foto en el sitio web"
									filename="Nombre de archivo"
									name="Jimmy Morales"
									score={5}
									title="Nombre de mi foto"
									username="shair.dev"
								/>
							</div>
						))}
						<Loader />
						{/** */}
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
