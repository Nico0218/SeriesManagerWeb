import { Backdrop, Button, Dialog, Fade } from '@mui/material';
import { useEffect, useState } from 'react';
import HttpHelper from '../../../../../../classes/http-helper';
import CustomCard from '../../../../../../custom-components/custom-card/custom-card';
import ImageCardProps from './image-card-props';

export default function ImageCard({ ImageID, DisplayName }: Readonly<ImageCardProps>) {
	const [dataImage, setDataImage] = useState<string>();

	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		HttpHelper.image.GetDataByID(ImageID).then(res => {
			setDataImage(res.imageData);
		});
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	const [image, setImage] = useState<string>();

	useEffect(() => {
		HttpHelper.image.GetThumbnailByID(ImageID, 200).then(res => {
			setImage(res.imageData);
		});
	}, []);

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
						src={`data:image/png;base64,${dataImage}`}
						onClick={() => {
							setOpen(false);
						}}
						onKeyUp={() => {
							setOpen(false);
						}}
					/>
				</Fade>
			</Dialog>
		</>
	);
}
