import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomCard from '../../../custom-components/custom-card/custom-card';
import { updateBreadcrumbLinks } from '../../../functions/bread-crumb-functions';
import { RouteHome, RouteHomeVideo, RouteImageFolders } from '../../../routes/app-routes';

export default function Home() {
	const navigate = useNavigate();
	useEffect(() => {
		updateBreadcrumbLinks([
			{
				label: `Home`,
				route: RouteHome(),
			},
		]);
	}, []);

	const onImageGalleryClick = () => {
		navigate(RouteImageFolders());
	};

	const onVideoGalleryClick = () => {
		navigate(RouteHomeVideo());
	};

	return (
		<Grid container spacing={2}>
			<CustomCard
				title="Image Galleries"
				description="View all the available image galleries"
				defaultAction={onImageGalleryClick}
				actions={<Button onClick={onImageGalleryClick}>Open</Button>}
			/>
			<CustomCard
				title="Video Galleries"
				description="View all the available video galleries"
				defaultAction={onVideoGalleryClick}
				actions={<Button onClick={onVideoGalleryClick}>Open</Button>}
			/>
		</Grid>
	);
}
