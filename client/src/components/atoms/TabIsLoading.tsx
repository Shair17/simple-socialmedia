import { FC } from 'react';

export const TabIsLoading: FC = () => {
	return (
		<div className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column">
			<span className="loader" style={{ width: '2rem', height: '2rem' }} />
			<span className="mt-2">Cargando...</span>
		</div>
	);
};
