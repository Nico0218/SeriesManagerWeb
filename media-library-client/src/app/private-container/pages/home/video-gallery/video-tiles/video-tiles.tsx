import {
	Box,
	Grid,
	List,
	ListItem,
	ListItemText,
	Pagination,
	Rating,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpHelper from '../../../../../classes/http-helper';
import IconButtonWrapper from '../../../../../custom-components/icon-button-wrapper/icon-button-wrapper';
import IconSelector from '../../../../../custom-components/icon-loader/icon-selector';
import ValidatedTextField from '../../../../../custom-components/inputs/validated-text/validated-text';
import NavItem from '../../../../../custom-components/nav-items/nav-item';
import ObjectStatus from '../../../../../enums/object-status';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import Video from '../../../../../interfaces/video';
import VideoGallery from '../../../../../interfaces/video-gallery';
import { RoutePrivateRoot, RouteVideoGallery, RouteVideos } from '../../../../../routes/app-routes';
import VideoPlayer from './video-player/video-player';

export default function VideoTiles() {
	const params = useParams();
	const videoGalleryID = useMemo(() => params?.videoGalleryID ?? '', [params?.videoGalleryID]);
	const [videoGallery, setVideoGallery] = useState<VideoGallery | undefined>();
	const [pageSetup, SetPageSetup] = useState({
		page: 1,
		pageSize: 12,
	});
	const [pageCount, setPageCount] = useState<number>();
	const [videoStream, setVideoStream] = useState<string>();
	const [isEdit, setIsEdit] = useState(false);
	const [totalVideoCount, setTotalVideoCount] = useState<number>();
	const [videos, SetVideos] = useState<Video[] | undefined>();

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

	const { data: videoGalleryData, isSuccess: isVideoGallerySuccess } = useQuery({
		...HttpHelper.videoGallery.GetByID(videoGalleryID),
		enabled: true,
	});

	const videoGetCountByGalleryQuery = useQuery({
		...HttpHelper.video.GetCountByGallery(videoGalleryID ?? ''),
		enabled: !!videoGalleryID,
	});

	const videosData = useQuery({
		...HttpHelper.video.GetByPage(videoGalleryID, pageSetup.page, pageSetup.pageSize),
		enabled: !!videoGallery,
	});

	useEffect(() => {
		if (videoGalleryID) {
			if (videoGetCountByGalleryQuery.isSuccess && videoGetCountByGalleryQuery.data) {
				setTotalVideoCount(videoGetCountByGalleryQuery.data.data);
			}
			if (videosData.isSuccess && videosData.data) {
				SetVideos(videosData.data);
			}
		}
	}, [
		videoGalleryID,
		pageSetup.page,
		pageSetup.pageSize,
		videoGetCountByGalleryQuery.isSuccess,
		videoGetCountByGalleryQuery.data,
		videosData.isSuccess,
		videosData.data,
	]);

	

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		SetPageSetup({ ...pageSetup, page: value, pageSize: 12});
		if (videosData) {
			if (videosData.isSuccess && videosData.data) {
				SetVideos(videosData.data);
			}
		}
	};

	useEffect(() => {
		if (totalVideoCount) {
			setPageCount(Math.ceil(totalVideoCount / pageSetup.pageSize));
		}
	}, [totalVideoCount, pageSetup.pageSize]);

	
	const onClickActiveVideo = (video: Video) => {
		setVideoStream(HttpHelper.videoStream.GetVideoStream(video.id));
	};

	useEffect(() => {
		if (videosData.data) {
			SetVideos(videosData.data)
		}
	}, [videosData])

	useEffect(() => {
		if (isVideoGallerySuccess && videoGalleryData) {
			setVideoGallery(videoGalleryData);
		}
	}, [isVideoGallerySuccess, videoGalleryData]);

	const renderPlayer = () => {
		if (videoStream) {
			return <VideoPlayer URL={videoStream}></VideoPlayer>;
		} else {
			return <Typography>No video has been selected.</Typography>;
		}
	};

	const renderVideos = useMemo(() => {
		if (!videos) return null;

		return (
			<Grid key={videoGallery?.id} container sx={{ border: 1, borderRadius: 2, p: 2, mb: 2 }}>
				<Grid item xs={6}>
					<IconButtonWrapper
						id={'edit'}
						icon={IconSelector.Edit}
						sx={{ margin: 1, display: isEdit ? 'none' : 'inline-flex' }}
						onClick={() => setIsEdit(true)}
					/>
					<IconButtonWrapper
						id={'save'}
						icon={IconSelector.Save}
						sx={{ margin: 1, display: isEdit ? 'inline-flex' : 'none' }}
						onClick={() => {
							if (videoGallery) {
								videoGallery.status = ObjectStatus.Modified;
								setVideoGallery(videoGallery);
								HttpHelper.videoGallery.Save(videoGallery);
								videoGallery.status = ObjectStatus.None;
							}
							setIsEdit(false);
						}}
					/>
					<IconButtonWrapper
						id={'cancel'}
						icon={IconSelector.Cancel}
						sx={{ margin: 1, display: isEdit ? 'inline-flex' : 'none' }}
						onClick={() => setIsEdit(false)}
					/>

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
								setVideoGallery(prevState => {
									if (!prevState) return prevState;
									const temp = { ...prevState };
									temp.rating = newValue;
									return temp;
								});
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
					<List dense={true}>
						<Box>
							<Pagination count={pageCount} page={pageSetup.page} onChange={handleChange} />
						</Box>
						{videos.map(video => (
							<ListItem>
								<ListItemText
									primary={video.displayName}
									onClick={() => {
										onClickActiveVideo(video);
									}}
								/>
							</ListItem>
						))}
					</List>
				</Grid>
				<Grid item xs={6}>
					{renderPlayer()}
				</Grid>
			</Grid>
		);
	}, [videos, videoGallery, isEdit, videoStream, renderPlayer]);

	return (
		<Grid container spacing={2}>
			{renderVideos}
		</Grid>
	);
}
