import { Button, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HttpHelper from '../../../../classes/http-helper';
import CustomCard from '../../../../custom-components/custom-card/custom-card';
import { updateBreadcrumbLinks } from '../../../../functions/bread-crumb-functions';
import VideoGallery from '../../../../interfaces/video-gallery';
import { RoutePrivateRoot, RouteVideoGallery, RouteVideos } from '../../../../routes/app-routes';

export default function VideoGalleryComp() {
	const navigate = useNavigate();
	const [videoGallerys, setVideoGallerys] = useState<VideoGallery[]>();

	const videoGalleryGetAllQuery = useQuery({
		...HttpHelper.videoGallery.GetAll(),
		enabled: true,
	});

	useEffect(() => {
		updateBreadcrumbLinks([
			{
				label: `Home`,
				route: RoutePrivateRoot(),
			},
			{
				label: 'Video Gallery',
				route: RouteVideoGallery(),
			},
		]);
	}, []);

	useEffect(() => {
		if (videoGalleryGetAllQuery.isSuccess && videoGalleryGetAllQuery.data) {
			setVideoGallerys(videoGalleryGetAllQuery.data);
		}
	}, [videoGalleryGetAllQuery.status, videoGalleryGetAllQuery.data]);

	const onVideoGalleryClick = (id: string) => {
		navigate(RouteVideos(id));
	};

	const renderVideoGalleryTiles = useMemo(() => {
		const components: React.JSX.Element[] = [];
		if (videoGallerys) {
			for (const videoGallery of videoGallerys) {
				components.push(
					<CustomCard
						key={videoGallery.id}
						title={videoGallery.name}
						defaultAction={() => {
							onVideoGalleryClick(videoGallery.id);
						}}
						actions={
							<Button
								onClick={() => {
									onVideoGalleryClick(videoGallery.id);
								}}
							>
								Open
							</Button>
						}
					/>
				);
			}
		}
		return components;
	}, [videoGallerys]);

	return (
		<Grid container spacing={2}>
			{renderVideoGalleryTiles}
		</Grid>
	);
}
