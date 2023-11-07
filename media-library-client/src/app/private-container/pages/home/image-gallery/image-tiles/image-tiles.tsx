import { Box, Grid, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpHelper from '../../../../../classes/http-helper';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import GalleryImage from '../../../../../interfaces/gallery-images';
import { RouteHome, RouteImageGallery, RouteImages } from '../../../../../routes/app-routes';
import ImageCard from './image-card/image-card';

export default function ImageTile() {
	const params = useParams();
	const [galleryData, setGalleryData] = useState<GalleryImage>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [totalImageCount, setTotalImageCount] = useState<number>();
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageCount, setPageCount] = useState<number>();
	const imageGalleryID = useMemo(() => params?.imageGalleryID ?? '', []);

	const queryGetByID = useQuery({
		...HttpHelper.image.GetByID(imageGalleryID),
		enabled: !!imageGalleryID,
	});

	const queryGetCountByID = useQuery({
		...HttpHelper.image.GetCountByGallery(imageGalleryID),
		enabled: true,
	})
	const queryGetByPage = useQuery({
		...HttpHelper.image.GetByPage(imageGalleryID, currentPage.toString(), pageSize.toString()),
		enabled: true
	})

	const queryGetDataByID = useQuery({
		...HttpHelper.image.GetByPage(imageGalleryID, currentPage.toString(), pageSize.toString()),
		enabled: true,
	});

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
		if (imageGalleryID) {
			if (queryGetDataByID.isSuccess && queryGetDataByID.data) {
				console.log('Get BY Page Result ' + JSON.stringify(queryGetDataByID.data))
				setImages(queryGetDataByID.data)
			}
		}
	};

	useEffect(() => {
		if (imageGalleryID) {
			if (queryGetByID.isSuccess && queryGetByID.data) {
				console.log('Get BY ID Result ' + JSON.stringify(queryGetByID.data))
				setGalleryData(queryGetByID.data);
			}
		}
	}, [imageGalleryID, queryGetByID.isSuccess, queryGetByID.data]);

	useEffect(() => {
		if (totalImageCount) {
			setPageCount(Math.ceil(totalImageCount / pageSize));
		}
	}, [totalImageCount, pageSize]);

	useEffect(() => {
		if (imageGalleryID) {
			if (queryGetCountByID.isSuccess && queryGetCountByID.data) {
				console.log('Get count Result ' + JSON.stringify(queryGetCountByID.data))
				setTotalImageCount(queryGetCountByID.data.data)
			}
			if (queryGetByPage.isSuccess && queryGetByPage.data) {
				console.log('Get by page Result ' + JSON.stringify(queryGetByPage.data))
				setImages(queryGetByPage.data)
			}
		}
	}, [imageGalleryID,
		currentPage,
		pageSize,
		queryGetCountByID.isSuccess,
		queryGetCountByID.data,
		queryGetByPage.isSuccess,
		queryGetByPage.data]);

	useEffect(() => {
		updateBreadcrumbLinks([
			{
				label: `Home`,
				route: RouteHome(),
			},
			{
				label: 'image Gallery',
				route: RouteImageGallery(),
			},
			{
				label: galleryData?.name ?? '',
				route: RouteImages(),
			},
		]);
	}, [galleryData]);

	const render = useMemo(() => {
		if (images) {
			const components: React.JSX.Element[] = [];
			for (const image of images) {
				components.push(
					<ImageCard key={image.id} ImageID={image.id} DisplayName={image.displayName} />
				);
			}
			return components;
		} else {
			return <div>an error occurred</div>;
		}
	}, [images]);

	return (
		<>
			<Box>
				<Pagination count={pageCount} page={currentPage} onChange={handleChange} />
			</Box>
			<Grid container spacing={2}>
				{render}
			</Grid>
		</>
	);
}
