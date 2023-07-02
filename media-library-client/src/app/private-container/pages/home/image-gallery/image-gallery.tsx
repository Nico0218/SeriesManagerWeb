import { useEffect } from 'react';
import { AddBreadCrumbItem } from '../../../../functions/bread-crumb-functions';
import AppRoutes from '../../../../routes/app-routes';

export default function ImageGallery() {
	useEffect(() => {
		AddBreadCrumbItem({ label: 'Image Gallery', route: AppRoutes.HomeImage });
	}, []);
	return <div></div>;
}
