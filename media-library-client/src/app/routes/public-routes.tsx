import { RouteObject } from 'react-router-dom';
import LazyErrorPage from '../common-pages/error-page/lazy-error-page';
import LazyPublicContainer from '../public-container/lazy-public-container';
import LazyLogin from '../public-container/pages/login/lazy-login';
import { RouteLogin, RoutePublicRoot } from './app-routes';
import UnprotectedRoute from './unprotected-route.tsx/unprotected-route';

export const publicRoutes: RouteObject[] = [
	{
		path: RoutePublicRoot(),
		element: (
			<UnprotectedRoute>
				<LazyPublicContainer />
			</UnprotectedRoute>
		),
		errorElement: <LazyErrorPage />,
		children: [
			{
				path: RouteLogin(),
				element: (
					<UnprotectedRoute>
						<LazyLogin />
					</UnprotectedRoute>
				),
			},
		],
	},
];

export default publicRoutes;
