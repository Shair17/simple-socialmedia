import { FC, PropsWithChildren } from 'react';
import { Layout } from '../../components/templates/Layout';

export const GalleryPage: FC<PropsWithChildren<{}>> = () => {
	return (
		<Layout>
			<div className="container is-max-widescreen p-5">gallery page</div>
		</Layout>
	);
};
