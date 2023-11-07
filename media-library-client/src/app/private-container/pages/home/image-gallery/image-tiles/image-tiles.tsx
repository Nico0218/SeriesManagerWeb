import { Box, Grid, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpHelper from '../../../../../classes/http-helper';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import GalleryImage from '../../../../../interfaces/gallery-images';
import { RouteHome, RouteImageGallery, RouteImages } from '../../../../../routes/app-routes';
import ImageCard from './image-card/image-card';
import GalleryData from 'src/app/interfaces/gallery-data';

export default function ImageTile() {
	const params = useParams();
	const [galleryData, setGalleryData] = useState<GalleryData>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [totalImageCount, setTotalImageCount] = useState<number>();
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageCount, setPageCount] = useState<number>();
	const imageGalleryID = useMemo(() => params?.imageGalleryID ?? '', []);

	const imageGetByIDQuery = useQuery({
		...HttpHelper.image.GetByID(imageGalleryID),
		enabled: !!imageGalleryID,
	});

	const imageGetCountByGalleryQuery = useQuery({
		...HttpHelper.image.GetCountByGallery(imageGalleryID),
		enabled: true,
	})
	const imageGetByPageQuery = useQuery({
		...HttpHelper.image.GetByPage(imageGalleryID, currentPage.toString(), pageSize.toString()),
		enabled: true
	})

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
		if (imageGalleryID) {
			if (imageGetByPageQuery.isSuccess && imageGetByPageQuery.data) {
				setImages(imageGetByPageQuery.data)
			}
		}
	};

	useEffect(() => {
		if (imageGalleryID) {
			if (imageGetByIDQuery.isSuccess && imageGetByIDQuery.data) {
				setGalleryData(imageGetByIDQuery.data);
			}
		}
	}, [imageGalleryID, imageGetByIDQuery.isSuccess, imageGetByIDQuery.data]);

	useEffect(() => {
		if (totalImageCount) {
			setPageCount(Math.ceil(totalImageCount / pageSize));
		}
	}, [totalImageCount, pageSize]);

	useEffect(() => {
		if (imageGalleryID) {
			if (imageGetCountByGalleryQuery.isSuccess && imageGetCountByGalleryQuery.data) {
				setTotalImageCount(imageGetCountByGalleryQuery.data.data)
			}
			if (imageGetByPageQuery.isSuccess && imageGetByPageQuery.data) {
				setImages(imageGetByPageQuery.data)
			}
		}
	}, [imageGalleryID,
		currentPage,
		pageSize,
		imageGetCountByGalleryQuery.isSuccess,
		imageGetCountByGalleryQuery.data,
		imageGetByPageQuery.isSuccess,
		imageGetByPageQuery.data]);

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
