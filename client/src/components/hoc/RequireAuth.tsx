import { useLocation, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

interface Props {
	children: JSX.Element;
}

export const RequireAuth = ({ children }: Props) => {
	const isAuthenticated = useIsAuthenticated();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};
