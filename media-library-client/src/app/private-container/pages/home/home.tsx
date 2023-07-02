import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomCard from '../../../custom-components/custom-card/custom-card';
import { AddBreadCrumbItem } from '../../../functions/bread-crumb-functions';
import AppRoutes from '../../../routes/app-routes';

export default function Home() {
	const navigate = useNavigate();
	useEffect(() => {
		AddBreadCrumbItem({ label: 'Home', route: AppRoutes.Home });
	}, []);

	const onImageGalleryClick = () => {
		navigate(AppRoutes.HomeImage);
	};

	const onVideoGalleryClick = () => {
		navigate(AppRoutes.HomeVideo);
	};

	return (
		<Grid container spacing={2}>
			<CustomCard
				title="Image Galleries"
				description='View all the available image galleries'
				defaultAction={onImageGalleryClick}
				children={<Button onClick={onImageGalleryClick}>Open</Button>}
			/>
			<CustomCard
				title="Video Galleries"
				description='View all the available video galleries'
				defaultAction={onVideoGalleryClick}
				children={<Button onClick={onVideoGalleryClick}>Open</Button>}
			/>
		</Grid>
	);
}
