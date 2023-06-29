import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Navigate } from 'react-router-dom';
import { userNameKey } from '../../../app/constants';
import { getLocalStorageItem } from '../../../app/functions/local-storage';
import AppRoutes from '../app-routes';
import UnprotectedRouteProps from './unprotected-route-props';

const UnprotectedRoute = ({
  children,
}: UnprotectedRouteProps): ReactJSXElement => {
  const hasUser = getLocalStorageItem(userNameKey);
  if (hasUser) {
    return <Navigate to={AppRoutes.Gallery} replace />;
  }

  return children;
};

export default UnprotectedRoute;
