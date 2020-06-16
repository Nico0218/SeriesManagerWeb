import { Injectable, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';
import { ImageGallery } from '../classes/Models/image-gallery';
import { Image } from '../classes/Models/image';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable()
export class ImageGalleryService {
    constructor(private httpClient: HttpClient,
        private configService: ConfigService,
        private domSanitizer: DomSanitizer) {
    }

    GetAllGalleries(): Observable<ImageGallery[]> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/ImageGallery/GetGalleries`)
            .pipe(
                map((ii: ImageGallery[]) => {
                    return ii;
                })
            );
    }

    GetAllImagesByGaleryID(GalleryID: string): Observable<Image[]> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/ImageGallery/GetAllImagesByGaleryID/${GalleryID}`)
            .pipe(
                map((ii: Image[]) => {
                    return ii;
                })
            );
    }

    GetGalleryByName(GalleryName: string): Observable<ImageGallery> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/ImageGallery/GetGalleryByName/${GalleryName}`)
            .pipe(
                map((ii: ImageGallery) => {
                    return ii;
                })
            );
    }

    GetImageByID(ImageID: string): Observable<Image> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/ImageGallery/GetImageByID/${ImageID}`)
            .pipe(
                map((ii: Image) => {
                    return ii;
                })
            );
    }

    GetImageDataByID(ImageID: string): Observable<SafeUrl> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/ImageGallery/GetImageDataByID/${ImageID}`)
            .pipe(
                map((ii: any) => {
                    let res = `data:image/jpg;base64,${ii.data as string}`;
                    return this.domSanitizer.bypassSecurityTrustUrl(res);
                })
            );
    }
}