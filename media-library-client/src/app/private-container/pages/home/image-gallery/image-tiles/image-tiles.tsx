import { Box, Grid, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import GalleryData from 'src/app/interfaces/gallery-data';
import HttpHelper from '../../../../../classes/http-helper';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import GalleryImage from '../../../../../interfaces/gallery-images';
import { RoutePrivateRoot, RouteImageGallery, RouteImages } from '../../../../../routes/app-routes';
import ImageCard from './image-card/image-card';

export default function ImageTile() {
	const params = useParams();
	const [imageGalleryID] = useState<string | undefined>(params.imageGalleryID);
	const [galleryData, setGalleryData] = useState<GalleryData>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [totalImageCount, setTotalImageCount] = useState<number>();
	const [pageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageCount, setPageCount] = useState<number>();

	const imageGalleryGetByIDQuery = useQuery({
		...HttpHelper.imageGallery.GetByID(imageGalleryID ?? ''),
		enabled: !!imageGalleryID,
	});

	const imageGetCountByGalleryQuery = useQuery({
		...HttpHelper.image.GetCountByGallery(imageGalleryID ?? ''),
		enabled: !!imageGalleryID,
	});
	const imageGetByPageQuery = useQuery({
		...HttpHelper.image.GetByPage(
			imageGalleryID ?? '',
			currentPage.toString(),
			pageSize.toString()
		),
		enabled: !!imageGalleryID,
	});

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
		if (imageGalleryID) {
			if (imageGetByPageQuery.isSuccess && imageGetByPageQuery.data) {
				setImages(imageGetByPageQuery.data);
			}
		}
	};

	useEffect(() => {
		if (imageGalleryGetByIDQuery.isSuccess && imageGalleryGetByIDQuery.data) {
			setGalleryData(imageGalleryGetByIDQuery.data);
		}
	}, [imageGalleryGetByIDQuery.isSuccess, imageGalleryGetByIDQuery.data]);

	useEffect(() => {
		if (totalImageCount) {
			setPageCount(Math.ceil(totalImageCount / pageSize));
		}
	}, [totalImageCount, pageSize]);

	useEffect(() => {
		if (imageGalleryID) {
			if (imageGetCountByGalleryQuery.isSuccess && imageGetCountByGalleryQuery.data) {
				setTotalImageCount(imageGetCountByGalleryQuery.data.data);
			}
			if (imageGetByPageQuery.isSuccess && imageGetByPageQuery.data) {
				setImages(imageGetByPageQuery.data);
			}
		}
	}, [
		imageGalleryID,
		currentPage,
		pageSize,
		imageGetCountByGalleryQuery.isSuccess,
		imageGetCountByGalleryQuery.data,
		imageGetByPageQuery.isSuccess,
		imageGetByPageQuery.data,
	]);

	useEffect(() => {
		if (galleryData) {
			updateBreadcrumbLinks([
				{
					label: `Home`,
					route: RoutePrivateRoot(),
				},
				{
					label: 'image Gallery',
					route: RouteImageGallery(),
				},
				{
					label: galleryData.name,
					route: RouteImages(galleryData.id),
				},
			]);
		}
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
