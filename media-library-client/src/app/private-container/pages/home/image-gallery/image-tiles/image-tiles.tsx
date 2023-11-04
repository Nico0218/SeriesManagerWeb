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
import { Box, Pagination, Typography } from '@mui/material';

export default function ImageTile() {
	const [galleryData, setGalleryData] = useState<GalleryData>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [totalImageCount, setTotalImageCount] = useState<number>();
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const params = useParams();
	const [folderID] = useState<string>(params?.FolderID ?? '');
	const [page , setPage] = useState<number>();
	const maxIMages = 4

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		httpHelper.Image.GetByPage(galleryID.id, value, 4).then(pages => {
			setImages(pages);
		});
	  };

	useEffect(() => {
		if (folderID) {
			httpHelper.ImageGallery.GetByID(folderID).then(galleryData => {
				setGalleryData(galleryData);
			});
		}
	}, [folderID]);

	useEffect(() => {
		if (galleryID) {
			httpHelper.Image.GetCountByGallery(galleryID.id).then(count => {
				setPageCount(Math.ceil(count.data / maxIMages));
			});
			httpHelper.Image.GetByPage(galleryID.id, 1, maxIMages).then(pages => {
				setImages(pages);
			});
		}
	}, [galleryData, currentPage, pageSize]);

	useEffect(() => {
		AddBreadCrumbItem({ label: 'Image Gallery', route: RouteHomeImage() });
		setPage(1)
	}, []);

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
				<Typography>Page: {page}</Typography>
				<Pagination count={pageCount} page={page} onChange={handleChange} />
			</Box>
			<Box>
				{render}
			</Box>
		</>
	)
}
