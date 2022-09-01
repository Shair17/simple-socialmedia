import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/templates/Layout';
import { isValidUUID } from '../../utils/validation';
import { NotFoundPage } from '../NotFound';
import useAxios from 'axios-hooks';
import { TabIsLoading } from '../../components/atoms/TabIsLoading';

export const Photo: FC = () => {
	const params = useParams();
	const photoId = params.id;
	const [{ error, loading, data }] = useAxios(`/photos/${photoId}`);

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
			<div className="container is-max-desktop p-5"></div>
		</Layout>
	);
};
