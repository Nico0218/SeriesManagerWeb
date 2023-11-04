import { ImageAPI, headers, isURLSet, requestMode } from "../classes/http-helper-const";
import urlCombine from "../functions/url-combine";
import GalleryImage from "../interfaces/gallery-images";
import ImageDataWrapper from "../interfaces/image-data-wrapper";

export class ImageService {

    async GetCountByGallery(GalleryID: string): Promise<number> {
        isURLSet();
        const url = urlCombine(ImageAPI, `GetCountByGallery/${GalleryID}`);
        const result = await fetch(url, {
            method: 'GET',
            headers: headers,
            body: null,
            mode: requestMode,
            credentials: 'include'
        })
        return result.clone().json()
    }

    async GetByPage(GalleryID: string, PageNo: number, PageSize: number): Promise<GalleryImage[]> {
        isURLSet();
        const url = urlCombine(ImageAPI, `GetByPage/${GalleryID}/${PageNo}/${PageSize}`);
        const result = await fetch(url, {
            method: 'GET',
            headers: headers,
            body: null,
            mode: requestMode,
            credentials: 'include'
        })
        return result.clone().json()
    }

    async GetByID(imageID: string): Promise<GalleryImage[]> {
        isURLSet();
        const url = urlCombine(ImageAPI, `GetByID/${imageID}`);
        const result = await fetch(url, {
            method: 'GET',
            headers: headers,
            body: null,
            mode: requestMode,
            credentials: 'include'
        })
        return result.clone().json()
    }


    async GetThumbnailByID(ImageID: string, ThumbnailSize: number): Promise<ImageDataWrapper> {
        isURLSet();
        const url = urlCombine(ImageAPI, `GetThumbnailByID/${ImageID}/${ThumbnailSize}`);
        const result = await fetch(url, {
            method: 'GET',
            headers: headers,
            body: null,
            mode: requestMode,
            credentials: 'include'
        })
        return result.clone().json()
    }

    async GetDataByID(ImageID: string): Promise<ImageDataWrapper> {
        isURLSet();
        const url = urlCombine(ImageAPI, `GetDataByID/${ImageID}`);
        const result = await fetch(url, {
            method: 'GET',
            headers: headers,
            body: null,
            mode: requestMode,
            credentials: 'include'
        })
        return result.clone().json()
    }

}