import { Navigate, RouteObject } from 'react-router-dom';
import LazyErrorPage from '../common-pages/error-page/lazy-error-page';
import LazyImageGallery from '../private-container/pages/home/image-gallery/lazy-image-gallery';
import LazyHome from '../private-container/pages/home/lazy-home';
import LazyVideoGallery from '../private-container/pages/home/video-gallery/lazy-video-gallery';
import LazyFolderLocations from '../private-container/pages/settings/lazy-folder-locations';
import PrivateContainer from '../private-container/private-container';
import ProtectedRoute from './protected-route/protected-route';
import { RouteFolderLocation, RouteHome, RouteImageFolders, RouteHomeVideo, RouteImages, RouteRoot } from './app-routes';
import LazyImageTiles from '../private-container/pages/home/image-gallery/image-tiles/lazy-image-tiles';

const privateRoutes: RouteObject[] = [
	{
		path: RouteRoot(),
		element: (
			<ProtectedRoute>
				<>
					<PrivateContainer />
					<Navigate to={RouteHome()} />
				</>
			</ProtectedRoute>
		),
		errorElement: <LazyErrorPage />,
		children: [
			{
				path: RouteHome(),
				element: (
					<ProtectedRoute>
						<LazyHome />
					</ProtectedRoute>
				),
			},
			{
				path: RouteFolderLocation(),
				element: (
					<ProtectedRoute>
						<LazyFolderLocations />
					</ProtectedRoute>
				),
			},
			{
				path: RouteImageFolders(),
				element: (
					<ProtectedRoute>
						<LazyImageGallery />
					</ProtectedRoute>
				),
			},
			{
				path: RouteHomeVideo(),
				element: (
					<ProtectedRoute>
						<LazyVideoGallery />
					</ProtectedRoute>
				),
			},
			{
				path: RouteImages(),
				element: (
					<ProtectedRoute>
						<LazyImageTiles />
					</ProtectedRoute>
				),
			},
		],
	},
];

export default privateRoutes;
