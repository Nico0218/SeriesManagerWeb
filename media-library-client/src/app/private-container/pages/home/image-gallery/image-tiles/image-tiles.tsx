import { Box, Grid, Pagination, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpHelper from '../../../../../classes/http-helper';
import GalleryData from '../../../../../interfaces/gallery-data';
import GalleryImage from '../../../../../interfaces/gallery-images';
import ImageCard from './image-card/image-card';
import { updateBreadcrumbLinks } from '../../../../../functions/bread-crumb-functions';
import { RouteHome, RouteImageFolders, RouteImages } from '../../../../../routes/app-routes';

export default function ImageTile() {
	const [galleryData, setGalleryData] = useState<GalleryData>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [totalImageCount, setTotalImageCount] = useState<number>();
	const [pageSize, setPageSize] = useState(2);
	const [currentPage, setCurrentPage] = useState(1);
	const params = useParams();
	const [folderID] = useState<string>(params?.FolderID ?? '');
	const [pageCount, setPageCount] = useState<number>();

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
		if (galleryData) {
			httpHelper.Image.GetByPage(galleryData.id, value, pageSize).then(pages => {
				setImages(pages);
			});
		}
	  };

	useEffect(() => {
		if (folderID) {
			httpHelper.ImageGallery.GetByID(folderID).then(galleryData => {
				setGalleryData(galleryData);
			});
		}
	}, [folderID]);

	useEffect(() => {
		if (totalImageCount) {
			setPageCount(Math.ceil(totalImageCount / pageSize))
		}
	}, [totalImageCount, pageSize])

	useEffect(() => {
		if (galleryData) {
			httpHelper.Image.GetCountByGallery(galleryData.id).then(count => {
				setTotalImageCount(count.data);
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
			<Box>
				<Pagination count={pageCount} page={currentPage} onChange={handleChange} />
			</Box>
			<Grid container spacing={2}>
				{render}
			</Grid>
		</>
	)
}
