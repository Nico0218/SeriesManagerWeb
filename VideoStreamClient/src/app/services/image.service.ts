import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { GalleryImage } from '../classes/Models/gallery-image';
import { ImageDataWrapper } from '../classes/Models/image-data-wrapper';

@Injectable()
export class ImageService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    public get controllerURL(): string {
        return `${Environment.apiUrl}/Image`;
    }

    GetCountByGallery(GalleryID: string): Observable<number> {
        return this.httpClient.get(`${this.controllerURL}/GetCountByGallery/${GalleryID}`)
            .pipe(
                map((ii: any) => {
                    return ii.data as number;
                })
            );
    }

    GetByPage(GalleryID: string, PageNo: number, PageSize: number): Observable<GalleryImage[]> {
        return this.httpClient.get(`${this.controllerURL}/GetByPage/${GalleryID}/${PageNo}/${PageSize}`)
            .pipe(
                map((ii: GalleryImage[]) => {
                    return ii;
                })
            );
    }

    GetByID(ImageID: string): Observable<GalleryImage> {
        return this.httpClient.get(`${this.controllerURL}/GetByID/${ImageID}`)
            .pipe(
                map((ii: GalleryImage) => {
                    return ii;
                })
            );
    }

    GetThumbnailByID(ImageID: string, ThumbnailSize: number): Observable<SafeUrl> {
        return this.httpClient.get(`${this.controllerURL}/GetThumbnailByID/${ImageID}/${ThumbnailSize}`)
            .pipe(
                map((ii: ImageDataWrapper) => {
                    let res = `data:image/jpg;base64,${ii.imageData}`;
                    return this.domSanitizer.bypassSecurityTrustUrl(res);
                })
            );
    }

    GetDataByID(ImageID: string): Observable<SafeUrl> {
        return this.httpClient.get(`${this.controllerURL}/GetDataByID/${ImageID}`)
            .pipe(
                map((ii: ImageDataWrapper) => {
                    let res = `data:image/jpg;base64,${ii.imageData}`;
                    return this.domSanitizer.bypassSecurityTrustUrl(res);
                })
            );
    }
}