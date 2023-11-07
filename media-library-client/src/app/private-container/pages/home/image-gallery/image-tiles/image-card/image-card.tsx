import { Backdrop, Button, Dialog, Fade } from '@mui/material';
import { useEffect, useState } from 'react';
import HttpHelper from '../../../../../../classes/http-helper';
import CustomCard from '../../../../../../custom-components/custom-card/custom-card';
import ImageCardProps from './image-card-props';
import { useQuery } from '@tanstack/react-query';
import ImageDataWrapper from 'src/app/interfaces/image-data-wrapper';

export default function ImageCard({ ImageID, DisplayName }: Readonly<ImageCardProps>) {
	const [dataImage, setDataImage] = useState<ImageDataWrapper>();
	const [open, setOpen] = useState(false);
	const [image, setImage] = useState<string>();

	const queryGetThumbnail = useQuery({
		...HttpHelper.image.GetThumbnailByID(ImageID, '200'),
		enabled: !!ImageID,
	});


	const queryGetData = useQuery({
		...HttpHelper.image.GetDataByID(ImageID),
		enabled: false
	}
	);

	useEffect(() => {
		if (queryGetThumbnail.isSuccess && queryGetThumbnail.data) {
			setImage(queryGetThumbnail.data.imageData);
		}
	}, [queryGetThumbnail.isSuccess, queryGetThumbnail.data]);

	const handleOpen = () => {
		queryGetData.refetch(); // Manually trigger the data query
		setOpen(true);
	};

	const handleClose = () => setOpen(false);



	useEffect(() => {
		if (queryGetData.isSuccess && queryGetData.data) {
			console.log('Get data by ID Result ' + JSON.stringify(queryGetData.data));
			setDataImage(queryGetData.data);
		}
	}, [queryGetData.isSuccess, queryGetData.data]);

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
						onClick={handleClose}
						onKeyUp={handleClose}
					/>
				</Fade>
			</Dialog>
		</>
	);
}
