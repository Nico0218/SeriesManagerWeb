import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpHelper from '../../../../classes/http-helper';
import CustomCard from '../../../../custom-components/custom-card/custom-card';
import { updateBreadcrumbLinks } from '../../../../functions/bread-crumb-functions';
import GalleryData from '../../../../interfaces/gallery-data';
import { RouteHome, RouteImageFolders, RouteImages } from '../../../../routes/app-routes';

export default function ImageGallery() {
	const navigate = useNavigate();
	const [galleryDatas, setGalleryDatas] = useState<GalleryData[]>([]);

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
		]);

		httpHelper.ImageGallery.GetAll().then(data => {
			setGalleryDatas(data);
		});
	}, []);

	const onImageGalleryClick = (id: string) => {
		navigate(RouteImages(id));
	};

	const render = useMemo(() => {
		const components: React.JSX.Element[] = [];
		for (const galleryData of galleryDatas) {
			components.push(
				<CustomCard
					key={galleryData.id}
					title={galleryData.displayName}
					defaultAction={() => {
						onImageGalleryClick(galleryData.id);
					}}
				/>
			);
		}
		return components;
	}, [galleryDatas]);

	return render;
}
