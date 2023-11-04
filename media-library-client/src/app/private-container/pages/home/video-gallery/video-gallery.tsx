import { useEffect } from 'react';
import { AddBreadCrumbItem } from '../../../../functions/bread-crumb-functions';
import { RouteHomeVideo } from '../../../../routes/app-routes';

export default function VideoGallery() {
	useEffect(() => {
		AddBreadCrumbItem({ label: 'Video Gallery', route: RouteHomeVideo()});
	}, []);
	return <div></div>;
} 
