import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/templates/Layout';

interface Props {
	message?: string;
}

export const NotFoundPage: FC<Props> = ({
	message = 'No se encontró la página.',
}) => {
	return (
		<Layout>
			<section className="hero is-fullheight">
				<div className="container has-text-centered mt-6">
					<h1 className="title">Error 404</h1>
					<h2 className="subtitle">{message}</h2>
					<Link to="/" className="button is-primary">
						Regresar a Inicio
					</Link>
				</div>
			</section>
		</Layout>
	);
};
