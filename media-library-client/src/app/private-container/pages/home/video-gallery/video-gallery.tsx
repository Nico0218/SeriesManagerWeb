import { useEffect } from 'react';
import { updateBreadcrumbLinks } from '../../../../functions/bread-crumb-functions';
import { RouteHome, RouteHomeVideo } from '../../../../routes/app-routes';

export default function VideoGallery() {
	useEffect(() => {
		updateBreadcrumbLinks([
			{
				label: `Home`,
				route: RouteHome(),
			},
			{
				label: 'Video Gallery',
				route: RouteHomeVideo(),
			},
		]);
	}, []);
	return <div>Video Gallery</div>;
}
