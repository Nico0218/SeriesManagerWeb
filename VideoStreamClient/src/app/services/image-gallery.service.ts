import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { Image } from '../classes/Models/image';
import { ImageGallery } from '../classes/Models/image-gallery';

@Injectable()
export class ImageGalleryService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    GetAllGalleries(): Observable<ImageGallery[]> {
        return this.httpClient.get(`${Environment.apiUrl}/ImageGallery/GetGalleries`)
            .pipe(
                map((ii: ImageGallery[]) => {
                    return ii;
                })
            );
    }

    GetAllImagesByGaleryID(GalleryID: string): Observable<Image[]> {
        return this.httpClient.get(`${Environment.apiUrl}/ImageGallery/GetAllImagesByGaleryID/${GalleryID}`)
            .pipe(
                map((ii: Image[]) => {
                    return ii;
                })
            );
    }

    GetGalleryByName(GalleryName: string): Observable<ImageGallery> {
        return this.httpClient.get(`${Environment.apiUrl}/ImageGallery/GetGalleryByName/${GalleryName}`)
            .pipe(
                map((ii: ImageGallery) => {
                    return ii;
                })
            );
    }

    GetImageByID(ImageID: string): Observable<Image> {
        return this.httpClient.get(`${Environment.apiUrl}/ImageGallery/GetImageByID/${ImageID}`)
            .pipe(
                map((ii: Image) => {
                    return ii;
                })
            );
    }

    GetImageDataByID(ImageID: string): Observable<SafeUrl> {
        return this.httpClient.get(`${Environment.apiUrl}/ImageGallery/GetImageDataByID/${ImageID}`)
            .pipe(
                map((ii: any) => {
                    let res = `data:image/jpg;base64,${ii.data as string}`;
                    return this.domSanitizer.bypassSecurityTrustUrl(res);
                })
            );
    }
}