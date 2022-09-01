import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { AuthRedirect } from '../hoc/AuthRedirect';

interface Props {
	title: string;
	description: string;
	footer: JSX.Element;
}

export const AuthLayout: FC<PropsWithChildren<Props>> = ({
	children,
	title,
	description,
	footer,
}) => {
	return (
		<AuthRedirect>
			<section className="hero is-fullheight">
				<div className="hero-body">
					<div className="container has-text-centered">
						<div className="column is-4 is-offset-4">
							<h3 className="title has-text-black">{title}</h3>
							<hr className="login-hr" />
							<p className="subtitle has-text-black">{description}</p>
							<div className="box">{children}</div>
							<p className="has-text-grey">{footer}</p>
						</div>
					</div>
				</div>
			</section>
		</AuthRedirect>
	);
};
