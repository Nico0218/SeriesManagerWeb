import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpHelper from '../../../../classes/http-helper';
import CustomCard from '../../../../custom-components/custom-card/custom-card';
import { AddBreadCrumbItem } from '../../../../functions/bread-crumb-functions';
import GalleryData from '../../../../interfaces/gallery-data';
import { RouteImages } from '../../../../routes/app-routes';

export default function ImageGallery() {
	const navigate = useNavigate();
	const [images, setImages] = useState<GalleryData[]>([]);

	useEffect(() => {
		AddBreadCrumbItem({ label: 'Image Gallery', route: RouteImages() });
		httpHelper.ImageGallery.GetAll().then(data => {
			setImages(data);
		})
	}, []);

	const onImageGalleryClick = (id: string) => {
		navigate(RouteImages(id));
	};

	const render = useMemo(() => {
		const components: React.JSX.Element[] = []
		for (let i = 0; i < images.length; i++) {
			const element = images[i];
			components.push(
				<CustomCard
					title={element.displayName}
					defaultAction={() => { onImageGalleryClick(element.id) }}
				/>
			)
			return components
		}
	}, [images])

	return render;
}
