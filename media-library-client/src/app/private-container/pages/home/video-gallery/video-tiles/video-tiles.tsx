import { Button, Grid, Rating, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpHelper from '../../../../../classes/http-helper';
import ObjectStatus from '../../../../../enums/object-status';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import Video from '../../../../../interfaces/video';
import VideoGallery from '../../../../../interfaces/video-gallery';
import { RoutePrivateRoot, RouteVideoGallery, RouteVideos } from '../../../../../routes/app-routes';
import VideoPlayer from './video-player/video-player';
import ValidatedTextField from '../../../../../custom-components/inputs/validated-text/validated-text';
import NavItem from '../../../../../custom-components/nav-items/nav-item';
import IconButtonWrapper from '../../../../../custom-components/icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../../../../../custom-components/icon-loader/icon-selector';

export default function VideoTiles() {
	const params = useParams();
	const videoGalleryID = useMemo(() => params?.videoGalleryID ?? '', [params?.videoGalleryID]);
	const [videoGallery, setVideoGallery] = useState<VideoGallery | undefined>();
	const [pageSetup] = useState({
		page: 1,
		pageSize: 12,
	});
	const [videoStream, setVideoStream] = useState<string>();
	const [isEdit, setIsEdit] = useState(false);

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
		console.log('Breadcrumb setup');
		console.log('Fetching videos');
	}, [videoGallery]);

	const { data: videoGalleryData, isSuccess: isVideoGallerySuccess } = useQuery({
		...HttpHelper.videoGallery.GetByID(videoGalleryID),
		enabled: true,
	});

	const { data: videosData } = useQuery({
		...HttpHelper.video.GetByPage(videoGalleryID, pageSetup.page, pageSetup.pageSize),
		enabled: !!videoGallery,
	});

	const onClickActiveVideo = (video: Video) => {
		setVideoStream(HttpHelper.videoStream.GetVideoStream(video.id));
	};

	useEffect(() => {
		console.log('trying to set Video Gallery');
		if (isVideoGallerySuccess && videoGalleryData) {
			console.log(`set Video Gallery as ${JSON.stringify(videoGalleryData)}`);
			setVideoGallery(videoGalleryData);
		}
	}, [isVideoGallerySuccess, videoGalleryData]);

	const renderPlayer = () => {
		if (videoStream) {
			console.log(`videoStream`, videoStream);
			return <VideoPlayer URL={videoStream}></VideoPlayer>;
		} else {
			return <Typography>No video has been selected.</Typography>;
		}
	};

	const renderVideos = useMemo(() => {
		console.log(`viodeos : ${JSON.stringify(videosData)}`);
		if (!videosData) return null;

		return videosData.map(video => (
			<Grid key={videoGallery?.id} container sx={{ border: 1, borderRadius: 2, p: 2, mb: 2 }}>
				<Grid item xs={6}>
				<IconButtonWrapper id={'edit'} icon={IconSelector.Edit} sx={{ margin: 1, display: isEdit ? 'none' : 'inline-flex' }} onClick={() => setIsEdit(true)} />
				<IconButtonWrapper id={'save'} icon={IconSelector.Save} sx={{ margin: 1, display: isEdit ? 'inline-flex' : 'none' }} onClick={() => {
					if (videoGallery) {
						HttpHelper.videoGallery.Save(videoGallery).then(res => alert(JSON.stringify(res))).catch(err => alert(JSON.stringify(err)));
					}
					setIsEdit(false)}} />
				<IconButtonWrapper id={'cancel'} icon={IconSelector.Cancel} sx={{ margin: 1, display: isEdit ? 'inline-flex' : 'none' }} onClick={() => setIsEdit(false)} />

					<ValidatedTextField
						id="name"
						label=""
						value={`${videoGallery?.name}`}
						isReadOnly={!isEdit}
						onChange={value => {
							setVideoGallery(prevState => {
								if (!prevState) return prevState;
								const temp = { ...prevState };
								temp.name = value;
								return temp;
							});
						}}
					/>

					<Rating
						name="no-value"
						sx={{ mb: 1, paddingTop: 1, marginLeft: 1 }}
						value={videoGallery?.rating ?? 0}
						onChange={(event, newValue) => {
							if (videoGallery && newValue) {
								videoGallery.rating = newValue;
								videoGallery.status = ObjectStatus.Modified;
								setVideoGallery(videoGallery);
								HttpHelper.videoGallery
									.Save(videoGallery)
									.then(res => alert(`Rating has been updated`))
									.catch(err => alert(`Save has been unsuccessful due to: ${err}`));
								videoGallery.status = ObjectStatus.None;
							}
						}}
					/>
					<ValidatedTextField
						id="series description"
						label="Description"
						value={videoGallery?.description}
						isReadOnly={!isEdit}
						onChange={value => {
							setVideoGallery(prevState => {
								if (!prevState) return prevState;
								const temp = { ...prevState };
								temp.description = value;
								return temp;
							});
						}}
					/>
					<NavItem title="My Anime List" href={`${videoGallery?.wikiLink}`} />
					<ValidatedTextField
						id="airing state"
						label="Airing State"
						value={`${videoGallery?.airingState}`}
						isReadOnly={!isEdit}
						onChange={value => {
							setVideoGallery(prevState => {
								if (!prevState) return prevState;
								const temp = { ...prevState };
								temp.airingState = +value;
								return temp;
							});
						}}
					/>
					<ValidatedTextField
						id="episode count"
						label="Episode Count"
						value={`${videoGallery?.episodeCount}`}
						isReadOnly={!isEdit}
						onChange={value => {
							setVideoGallery(prevState => {
								if (!prevState) return prevState;
								const temp = { ...prevState };
								temp.episodeCount = +value;
								return temp;
							});
						}}
					/>
					<Typography
						onClick={() => {
							onClickActiveVideo(video);
						}}
						sx={{ fontSize: 17, fontWeight: 'bold', paddingTop: 1, marginLeft: 3 }}
					>
						{video.displayName}
					</Typography>
				</Grid>
				<Grid item xs={6}>
					{renderPlayer()}
				</Grid>
			</Grid>
		));
	}, [videosData, videoGallery, isEdit, videoStream, renderPlayer]);

	return (
		<Grid container spacing={2}>
			{renderVideos}
		</Grid>
	);
}
