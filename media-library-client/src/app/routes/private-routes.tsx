import { Navigate, RouteObject } from 'react-router-dom';
import LazyErrorPage from '../common-pages/error-page/lazy-error-page';
import LazyImageGallery from '../private-container/pages/home/image-gallery/lazy-image-gallery';
import LazyHome from '../private-container/pages/home/lazy-home';
import LazyVideoGallery from '../private-container/pages/home/video-gallery/lazy-video-gallery';
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
					<Navigate to={AppRoutes.Home} />
				</>
			</ProtectedRoute>
		),
		errorElement: <LazyErrorPage />,
		children: [
			{
				path: AppRoutes.Home,
				element: (
					<ProtectedRoute>
						<LazyHome />
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
			{
				path: AppRoutes.HomeImage,
				element: (
					<ProtectedRoute>
						<LazyImageGallery />
					</ProtectedRoute>
				),
			},
			{
				path: AppRoutes.HomeVideo,
				element: (
					<ProtectedRoute>
						<LazyVideoGallery />
					</ProtectedRoute>
				),
			},
		],
	},
];

export default privateRoutes;
