import { FC } from 'react';

export const Footer: FC = () => {
	return (
		<footer className="footer">
			<div className="content has-text-centered">
				<p>
					<strong>Red Social</strong> por Jeanpier, José, Jordy y Jimmy. ©{' '}
					{new Date().getFullYear().toString()}.
				</p>
			</div>
		</footer>
	);
};
