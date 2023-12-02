import { Backdrop, Button, Dialog, Fade } from '@mui/material';
import { useEffect, useState } from 'react';
import HttpHelper from '../../../../../../classes/http-helper';
import CustomCard from '../../../../../../custom-components/custom-card/custom-card';
import ImageCardProps from './image-card-props';
import { useQuery } from '@tanstack/react-query';
import ImageDataWrapper from '../../../../../../interfaces/image-data-wrapper';

export default function ImageCard({ ImageID, DisplayName }: Readonly<ImageCardProps>) {
	const [dataImage, setDataImage] = useState<ImageDataWrapper>();
	const [open, setOpen] = useState(false);
	const [image, setImage] = useState<string>();

	const imageGetThumbnailByIDQuery = useQuery({
		...HttpHelper.image.GetThumbnailByID(ImageID, '200'),
		enabled: !!ImageID,
	});


	const imageGetDataByIDQuery = useQuery({
		...HttpHelper.image.GetDataByID(ImageID),
		enabled: open
	}
	);

	useEffect(() => {
		if (imageGetThumbnailByIDQuery.isSuccess && imageGetThumbnailByIDQuery.data) {
			setImage(imageGetThumbnailByIDQuery.data.imageData);
		}
	}, [imageGetThumbnailByIDQuery.isSuccess, imageGetThumbnailByIDQuery.data]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => setOpen(false);



	useEffect(() => {
		if (imageGetDataByIDQuery.isSuccess && imageGetDataByIDQuery.data) {
			setDataImage(imageGetDataByIDQuery.data);
		}
	}, [imageGetDataByIDQuery.isSuccess, imageGetDataByIDQuery.data]);

	return (
		<>
			<CustomCard
				title={DisplayName}
				imgSrc={`data:image/png;base64,${image}`}
				defaultAction={handleOpen}
				actions={[
					<Button key="Rename" size="small">
						Rename
					</Button>,
					<Button key="Download" size="small">
						Download
					</Button>,
					<Button key="Delete" size="small">
						Delete
					</Button>,
				]}
			/>
			<Dialog
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
				fullScreen
			>
				<Fade in={open}>
					<img
						height="100%"
						src={`data:image/png;base64,${dataImage?.imageData}`}
						onClick={handleClose}
						onKeyUp={handleClose}
						alt='Nothing to display!'
					/>
				</Fade>
			</Dialog>
		</>
	);
}
