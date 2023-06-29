import { RouteObject } from 'react-router-dom';
import LazyErrorPage from '../common-pages/error-page/lazy-error-page';
import LazyPublicContainer from '../public-container/lazy-public-container';
import AppRoutes from './app-routes';
import UnprotectedRoute from './unprotected-route.tsx/unprotected-route';

export const publicRoutes: RouteObject[] = [
  {
    path: AppRoutes.Login,
    element: (
      <UnprotectedRoute>
        <LazyPublicContainer />
      </UnprotectedRoute>
    ),
    errorElement: <LazyErrorPage />,
  },
];

export default publicRoutes;
