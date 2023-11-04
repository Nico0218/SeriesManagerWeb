import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpHelper from '../../../../../classes/http-helper';
import { AddBreadCrumbItem } from '../../../../../functions/bread-crumb-functions';
import GalleryData from '../../../../../interfaces/gallery-data';
import GalleryImage from '../../../../../interfaces/gallery-images';
import { RouteHomeImage } from '../../../../../routes/app-routes';
import ImageCard from './image-card/image-card';

export default function ImageTile() {
	const [galleryID, setGalleryID] = useState<GalleryData>();
	const [images, setImages] = useState<GalleryImage[]>();
	const [pageCount, setPageCount] = useState<number>();
	const params = useParams();
	const [folderID] = useState<string>(params?.FolderID ?? '');

	useEffect(() => {
		if (folderID) {
			httpHelper.ImageGallery.GetByID(folderID).then(folderGUID => {
				setGalleryID(folderGUID);
			});
		}
	}, [folderID]);

	useEffect(() => {
		if (galleryID) {
			httpHelper.Image.GetCountByGallery(galleryID.id).then(count => {
				setPageCount(count);
			});
			httpHelper.Image.GetByPage(galleryID.id, 1, 10).then(pages => {
				setImages(pages);
			});
		}
	}, [galleryID]);

	useEffect(() => {
		AddBreadCrumbItem({ label: 'Image Gallery', route: RouteHomeImage() });
	}, []);

	const render = useMemo(() => {
		if (images) {
			const components: React.JSX.Element[] = [];
			for (const image of images) {
				components.push(<ImageCard key={image.id} ImageID={image.id} DisplayName={image.displayName} />);
			}
			return components;
		} else {
			return <div>an error occurred</div>;
		}
	}, [images]);

	return render;
}
