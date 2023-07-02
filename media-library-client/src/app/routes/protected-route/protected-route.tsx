import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Navigate } from 'react-router-dom';
import UserInfo from '../../classes/user-info';
import { userInfoKey } from '../../constants';
import { getLocalStorageItem } from '../../functions/local-storage';
import AppRoutes from '../app-routes';
import ProtectedRouteProps from './protected-route-props';

const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactJSXElement => {
	const hasUser = getLocalStorageItem<UserInfo>(userInfoKey);
	if (!hasUser) {
		return <Navigate to={AppRoutes.Login} replace />;
	}

	return children;
};

export default ProtectedRoute;
