import { Box, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpHelper from '../../../../../classes/http-helper';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import Video from '../../../../../interfaces/video';
import VideoGallery from '../../../../../interfaces/video-gallery';
import { RoutePrivateRoot, RouteVideoGallery, RouteVideos } from '../../../../../routes/app-routes';

export default function VideoTiles() {
	const params = useParams();
	const videoGalleryID = useMemo(() => params?.videoGalleryID ?? '', []);
	const [videoGallery, setVideoGallery] = useState<VideoGallery>();
	const [videos, setVideos] = useState<Video[]>();

	const videoGalleryGetAllQuery = useQuery({
		...HttpHelper.videoGallery.GetByID(videoGalleryID),
		enabled: true,
	});

	const videoGetByGalleryQuery = useQuery({
		...HttpHelper.video.GetByGallery(videoGalleryID),
		enabled: !!videoGalleryID,
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
			{
				label: videoGallery?.name ?? '',
				route: RouteVideos(videoGallery?.id),
			},
		]);
	}, [videoGallery]);

	useEffect(() => {
		if (videoGalleryGetAllQuery.isSuccess && videoGalleryGetAllQuery.data) {
			setVideoGallery(videoGalleryGetAllQuery.data);
		}
	}, [videoGalleryGetAllQuery.status, videoGalleryGetAllQuery.data]);

	useEffect(() => {
		if (videoGetByGalleryQuery.isSuccess && videoGetByGalleryQuery.data) {
			setVideos(videoGetByGalleryQuery.data);
		}
	}, [videoGetByGalleryQuery.status, videoGetByGalleryQuery.data]);

	const renderTiles = useMemo(() => {
		const components: React.JSX.Element[] = [];
		if (videos) {
			for (const video of videos) {
				components.push(<Box key={video.id}>{video.name}</Box>);
			}
		}
		return components;
	}, [videos]);

	return (
		<Grid container spacing={2}>
			{renderTiles}
		</Grid>
	);
}
