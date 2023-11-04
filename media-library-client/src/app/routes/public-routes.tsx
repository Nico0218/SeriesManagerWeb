import { RouteObject } from 'react-router-dom';
import LazyErrorPage from '../common-pages/error-page/lazy-error-page';
import LazyPublicContainer from '../public-container/lazy-public-container';
import UnprotectedRoute from './unprotected-route.tsx/unprotected-route';
import { RouteLogin } from './app-routes';

export const publicRoutes: RouteObject[] = [
	{
		path: RouteLogin(),
		element: (
			<UnprotectedRoute>
				<LazyPublicContainer />
			</UnprotectedRoute>
		),
		errorElement: <LazyErrorPage />,
	},
];

export default publicRoutes;
