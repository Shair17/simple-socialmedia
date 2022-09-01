import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/templates/Layout';
import { isValidUUID } from '../../utils/validation';
import { NotFoundPage } from '../NotFound';
import useAxios from 'axios-hooks';
import { TabIsLoading } from '../../components/atoms/TabIsLoading';

export const Gallery: FC = () => {
	const params = useParams();
	const galleryId = params.id;
	const [{ error, loading, data }] = useAxios(`/gallery/${galleryId}`);

	if (loading) {
		return (
			<div className="mt-6">
				<TabIsLoading />
			</div>
		);
	}

	if (!isValidUUID(galleryId!) || error || !data) {
		return <NotFoundPage message="No se encontró la galería." />;
	}

	return (
		<Layout>
			<div className="container is-max-desktop p-5"></div>
		</Layout>
	);
};
