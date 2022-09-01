import { FC } from 'react';
import { RequireAuth } from '../components/hoc/RequireAuth';
import { Layout } from '../components/templates/Layout';

export const NewGalleryPage: FC = () => {
	return (
		<RequireAuth>
			<Layout>
				<div>new</div>
			</Layout>
		</RequireAuth>
	);
};
