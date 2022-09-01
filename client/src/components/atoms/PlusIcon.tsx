import { FC } from 'react';

export const PlusIcon: FC = () => {
	return (
		<svg
			style={{ width: '1.5rem', height: '1.5rem' }}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M12 6v6m0 0v6m0-6h6m-6 0H6"
			></path>
		</svg>
	);
};
