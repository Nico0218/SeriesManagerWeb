import { Grid, Toolbar, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ValidatedNumber from 'src/app/custom-components/inputs/validated-number/validated-number';
import httpHelper from '../../../../../classes/http-helper';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import GalleryData from '../../../../../interfaces/gallery-data';
import GalleryImage from '../../../../../interfaces/gallery-images';
import { RouteHome, RouteImageFolders, RouteImages } from '../../../../../routes/app-routes';
import ImageCard from './image-card/image-card';

export default function ImageTile() {
	const [galleryData, setGalleryData] = useState<GalleryData>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [totalImageCount, setTotalImageCount] = useState<number>();
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const params = useParams();
	const folderID = useMemo(() => params?.FolderID ?? '', []);

	useEffect(() => {
		if (folderID) {
			httpHelper.ImageGallery.GetByID(folderID).then(galleryData => {
				setGalleryData(galleryData);
			});
		}
	}, [folderID]);

	useEffect(() => {
		if (galleryData) {
			httpHelper.Image.GetCountByGallery(galleryData.id).then(result => {
				setTotalImageCount(result.data);
			});
			httpHelper.Image.GetByPage(galleryData.id, currentPage, pageSize).then(pages => {
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
				label: 'Image Gallery',
				route: RouteImageFolders(),
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
			<Toolbar sx={{ backgroundColor: 'grey' }}>
				<Typography>
					Page Count: {Math.ceil(totalImageCount ? totalImageCount / pageSize : 0)}
				</Typography>
				<ValidatedNumber
					id={'current-page'}
					label={'Current Page'}
					value={currentPage}
					onChange={val => setCurrentPage(val)}
				/>
				<ValidatedNumber
					id={'page-size'}
					label={'Page Size'}
					value={pageSize}
					onChange={val => setPageSize(val)}
				/>
			</Toolbar>
			<Grid container spacing={2}>
				{render}
			</Grid>
		</>
	);
}
