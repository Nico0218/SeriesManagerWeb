import { Dispatch, SetStateAction } from 'react';
import GalleryImage from '../../../../../../interfaces/gallery-images';

export default interface ImageCardProps {
	galleryImage: GalleryImage;
	setGalleryImages: Dispatch<SetStateAction<GalleryImage[] | undefined>>;
}
