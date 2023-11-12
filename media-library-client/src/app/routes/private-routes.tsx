import { RouteObject } from 'react-router-dom';
import LazyErrorPage from '../common-pages/error-page/lazy-error-page';
import LazyImageTiles from '../private-container/pages/home/image-gallery/image-tiles/lazy-image-tiles';
import LazyImageGallery from '../private-container/pages/home/image-gallery/lazy-image-gallery';
import LazyHome from '../private-container/pages/home/lazy-home';
import LazyVideoGallery from '../private-container/pages/home/video-gallery/lazy-video-gallery';
import LazyVideoTiles from '../private-container/pages/home/video-gallery/video-tiles/lazy-video-tiles';
import LazyFolderLocations from '../private-container/pages/settings/lazy-folder-locations';
import PrivateContainer from '../private-container/private-container';
import {
	RouteFolderLocation,
	RouteImageGallery,
	RouteImages,
	RoutePrivateRoot,
	RouteVideoGallery,
	RouteVideos,
} from './app-routes';
import ProtectedRoute from './protected-route/protected-route';

const privateRoutes: RouteObject[] = [
	{
		path: RoutePrivateRoot(),
		element: (
			<ProtectedRoute>
				<PrivateContainer />
			</ProtectedRoute>
		),
		errorElement: <LazyErrorPage />,
		children: [
			{
				path: RoutePrivateRoot(),
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
				path: RouteImageGallery(),
				element: (
					<ProtectedRoute>
						<LazyImageGallery />
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
			{
				path: RouteVideoGallery(),
				element: (
					<ProtectedRoute>
						<LazyVideoGallery />
					</ProtectedRoute>
				),
			},
			{
				path: RouteVideos(),
				element: (
					<ProtectedRoute>
						<LazyVideoTiles />
					</ProtectedRoute>
				),
			},
		],
	},
];

export default privateRoutes;
