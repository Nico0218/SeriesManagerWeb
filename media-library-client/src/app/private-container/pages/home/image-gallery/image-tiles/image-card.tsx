import { Button, Card, CardActions, CardContent, CardMedia, Fade, Modal, Typography } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import { useEffect, useState } from "react";
import HttpHelper from "../../../../../classes/http-helper";
import ImageCardProps from "./image-card-props";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ImageCard({ ImageID, DisplayName }: ImageCardProps) {
    const [dataImage, setDataImage] = useState<string>();

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        HttpHelper.Image.GetDataByID(ImageID).then(res => {
            setDataImage(res.imageData)
        })
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const [image, setImage] = useState<string>();

    useEffect(() => {
        HttpHelper.Image.GetThumbnailByID(ImageID, 200).then(res => {
            setImage(res.imageData)
        })
    }, [])

    return (
        <>
            <Card sx={{ maxWidth: 345 }} onClick={handleOpen}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={`data:image/png;base64,${image}`}
                    title={DisplayName}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {DisplayName}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Rename</Button>
                    <Button size="small">Download</Button>
                    <Button size="small">Delete</Button>
                </CardActions>
            </Card>
            <Modal
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
            >
                <Fade in={open}>
                    <img height='100%' src={`data:image/png;base64,${dataImage}`} />
                </Fade>
            </Modal>
        </>

    )

}