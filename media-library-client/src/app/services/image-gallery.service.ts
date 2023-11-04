import { ImageGalleryAPI, headers, isURLSet, requestMode } from '../classes/http-helper-const';
import urlCombine from '../functions/url-combine';
import GalleryData from '../interfaces/gallery-data';
 
export class ImageGalleryService {

    async GetAll(): Promise<GalleryData[]> {
        isURLSet();
        const url = urlCombine(ImageGalleryAPI, 'GetAll');
        const result = await fetch(url, {
            method: 'GET',
            headers: headers,
            body: null,
            mode: requestMode,
            credentials: 'include'
        })

        return result.clone().json()
    }


    async GetByID(imageID: string) : Promise<GalleryData> {
        isURLSet();
        const url = urlCombine(ImageGalleryAPI, `GetByID/${imageID}`);
        const result = await fetch(url, {
            method: 'GET',
            headers: headers,
            body: null,
            mode: requestMode,
            credentials: 'include'
        })

        return result.clone().json()
    }

    GetByName(imageName: string) {
        isURLSet();
        const url = urlCombine(ImageGalleryAPI, 'GetByName');
        fetch(url, {
            method: 'GET',
            headers: headers,
            body: imageName,
            mode: requestMode,
            credentials: 'include'
        })
            .catch(err => console.error(err));
    }

}