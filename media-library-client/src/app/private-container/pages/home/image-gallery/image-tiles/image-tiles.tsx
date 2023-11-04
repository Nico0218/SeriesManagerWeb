import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpHelper from '../../../../../classes/http-helper';
import { AddBreadCrumbItem } from '../../../../../functions/bread-crumb-functions';
import GalleryData from '../../../../../interfaces/gallery-data';
import GalleryImage from '../../../../../interfaces/gallery-images';
import { RouteHomeImage } from '../../../../../routes/app-routes';
import ImageCard from './image-card';

export default function ImageTile() {

    const [galaryID, setGalaryID] = useState<GalleryData>();
    const [images, setImages] = useState<GalleryImage[]>();
    const [pageCount, setPageCount] = useState<number>();
    const params = useParams();
    const [folderID] = useState<string>(params?.FolderID ?? '');

    useEffect(() => {
        if (folderID) {
            httpHelper.ImageGallery.GetByID(folderID).then(folderGUID => {
                setGalaryID(folderGUID)
            })
        }
    }, [folderID])

    useEffect(() => {
        if (galaryID) {
            httpHelper.Image.GetCountByGallery(galaryID.id).then(count => {
                setPageCount(count)
            })
            httpHelper.Image.GetByPage(galaryID.id, 1, 10).then(pages => {
                setImages(pages)
            })
        }
    }, [galaryID])


    useEffect(() => {
        AddBreadCrumbItem({ label: 'Image Gallery', route: RouteHomeImage() });
    }, []);

    const render = useMemo(() => {
        const components: React.JSX.Element[] = []
        if (images) {
            for (let i = 0; i < images.length; i++) {
                const element = images[i];
                components.push(
                    <ImageCard ImageID={element.id} DisplayName={element.displayName}/>
                )
            }
            return components
        }
        else {
            return <div>an error occured</div>
        }

    }, [images])



    return render
}