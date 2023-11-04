import { Box, Grid, Pagination } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpHelper from '../../../../../classes/http-helper';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import GalleryData from '../../../../../interfaces/gallery-data';
import GalleryImage from '../../../../../interfaces/gallery-images';
import { RouteHome, RouteImageGallery, RouteImages } from '../../../../../routes/app-routes';
import ImageCard from './image-card/image-card';

export default function ImageTile() {
	const params = useParams();
	const [galleryData, setGalleryData] = useState<GalleryData>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [totalImageCount, setTotalImageCount] = useState<number>();
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageCount, setPageCount] = useState<number>();
	const imageGalleryID = useMemo(() => params?.imageGalleryID ?? '', []);

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
		if (galleryData) {
			HttpHelper.image.GetByPage(galleryData.id, value, pageSize).then(pages => {
				setImages(pages);
			});
		}
	};

	useEffect(() => {
		if (imageGalleryID) {
			HttpHelper.imageGallery.GetByID(imageGalleryID).then(galleryData => {
				setGalleryData(galleryData);
			});
		}
	}, [imageGalleryID]);

	useEffect(() => {
		if (totalImageCount) {
			setPageCount(Math.ceil(totalImageCount / pageSize));
		}
	}, [totalImageCount, pageSize]);

	useEffect(() => {
		if (galleryData) {
			HttpHelper.image.GetCountByGallery(galleryData.id).then(count => {
				setTotalImageCount(count.data);
			});
			HttpHelper.image.GetByPage(galleryData.id, currentPage, pageSize).then(pages => {
				setImages(pages);
			});
		}
	}, [galleryData, currentPage, pageSize]);

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
