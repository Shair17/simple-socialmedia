import { FC } from 'react';

export const Footer: FC = () => {
	return (
		<footer className="footer">
			<div className="content has-text-centered">
				<p>
					<strong>Red Social</strong> por Jeanpier, Jennifer, Jimmy, Jordy y
					José. © {new Date().getFullYear().toString()}.
				</p>
			</div>
		</footer>
	);
};
