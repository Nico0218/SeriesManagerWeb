import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Navigate } from 'react-router-dom';
import { userNameKey } from '../../../app/constants';
import { getLocalStorageItem } from '../../../app/functions/local-storage';
import AppRoutes from '../app-routes';
import ProtectedRouteProps from './protected-route-props';

const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactJSXElement => {
  const hasUser = getLocalStorageItem(userNameKey);
  if (!hasUser) {
    return <Navigate to={AppRoutes.Login} replace />;
  }

  return children;
};

export default ProtectedRoute;
