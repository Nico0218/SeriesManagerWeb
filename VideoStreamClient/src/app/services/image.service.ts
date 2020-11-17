import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { GalleryImage } from '../classes/Models/gallery-image';
import { ImageDataWrapper } from '../classes/Models/image-data-wrapper';
import { ImageGallery } from '../classes/Models/image-gallery';

@Injectable()
export class ImageService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    public get controllerURL(): string {
        return `${Environment.apiUrl}/Image`;
    }

    GetAllImagesByGaleryID(GalleryID: string): Observable<GalleryImage[]> {
        return this.httpClient.get(`${this.controllerURL}/GetAllImagesByGaleryID/${GalleryID}`)
            .pipe(
                map((ii: GalleryImage[]) => {
                    return ii;
                })
            );
    }

    GetImagesByPage(GalleryID: string, PageNo: number, PageSize: number): Observable<GalleryImage[]> {
        return this.httpClient.get(`${this.controllerURL}/GetImagesByPage/${GalleryID}/${PageNo}/${PageSize}`)
            .pipe(
                map((ii: GalleryImage[]) => {
                    return ii;
                })
            );
    }

    GetImageByID(ImageID: string): Observable<GalleryImage> {
        return this.httpClient.get(`${this.controllerURL}/GetImageByID/${ImageID}`)
            .pipe(
                map((ii: GalleryImage) => {
                    return ii;
                })
            );
    }

    GetImageThumbnailByID(ImageID: string, ThumbnailSize: number): Observable<SafeUrl> {
        return this.httpClient.get(`${this.controllerURL}/GetImageThumbnailByID/${ImageID}/${ThumbnailSize}`)
            .pipe(
                map((ii: ImageDataWrapper) => {
                    let res = `data:image/jpg;base64,${ii.imageData}`;
                    return this.domSanitizer.bypassSecurityTrustUrl(res);
                })
            );
    }

    GetImageDataByID(ImageID: string): Observable<SafeUrl> {
        return this.httpClient.get(`${this.controllerURL}/GetImageDataByID/${ImageID}`)
            .pipe(
                map((ii: ImageDataWrapper) => {
                    let res = `data:image/jpg;base64,${ii.imageData}`;
                    return this.domSanitizer.bypassSecurityTrustUrl(res);
                })
            );
    }
}