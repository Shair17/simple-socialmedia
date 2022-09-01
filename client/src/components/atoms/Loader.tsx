import { FC } from 'react';

export const Loader: FC = () => {
	return (
		<div className="is-flex is-justify-content-center">
			<span className="loader" style={{ width: '1.5rem', height: '1.5rem' }} />
		</div>
	);
};
