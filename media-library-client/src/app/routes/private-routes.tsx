import { Navigate, RouteObject } from 'react-router-dom';
import LazyErrorPage from '../common-pages/error-page/lazy-error-page';
import LazyGallery from '../private-container/pages/gallery/lazy-gallery';
import LazyFolderLocations from '../private-container/pages/settings/lazy-folder-locations';
import PrivateContainer from '../private-container/private-container';
import AppRoutes from './app-routes';
import ProtectedRoute from './protected-route/protected-route';

const privateRoutes: RouteObject[] = [
	{
		path: AppRoutes.Root,
		element: (
			<ProtectedRoute>
				<>
					<PrivateContainer />
					<Navigate to={AppRoutes.Gallery} />
				</>
			</ProtectedRoute>
		),
		errorElement: <LazyErrorPage />,
		children: [
			{
				path: AppRoutes.Gallery,
				element: (
					<ProtectedRoute>
						<LazyGallery />
					</ProtectedRoute>
				),
			},
			{
				path: AppRoutes.FolderLocation,
				element: (
					<ProtectedRoute>
						<LazyFolderLocations />
					</ProtectedRoute>
				),
			},
		],
	},
];

export default privateRoutes;
