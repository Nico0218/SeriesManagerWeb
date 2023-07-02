import { useEffect } from 'react';
import { AddBreadCrumbItem } from '../../../../functions/bread-crumb-functions';
import AppRoutes from '../../../../routes/app-routes';

export default function VideoGallery() {
	useEffect(() => {
		AddBreadCrumbItem({ label: 'Video Gallery', route: AppRoutes.HomeVideo });
	}, []);
	return <div></div>;
}
