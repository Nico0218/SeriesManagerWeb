import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { ImageGallery } from '../classes/Models/image-gallery';

@Injectable()
export class ImageGalleryService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    public get controllerURL(): string {
        return `${Environment.apiUrl}/ImageGallery`;
    }

    GetAllGalleries(): Observable<ImageGallery[]> {
        return this.httpClient.get(`${this.controllerURL}/GetGalleries`)
            .pipe(
                map((ii: ImageGallery[]) => {
                    return ii;
                })
            );
    }

    GetGalleryByName(GalleryName: string): Observable<ImageGallery> {
        return this.httpClient.get(`${this.controllerURL}/GetGalleryByName/${GalleryName}`)
            .pipe(
                map((ii: ImageGallery) => {
                    return ii;
                })
            );
    }

    GetGalleryImageCount(GalleryID: string): Observable<number> {
        return this.httpClient.get(`${this.controllerURL}/GetGalleryImageCount/${GalleryID}`)
            .pipe(
                map((ii: any) => {
                    return ii.data as number;
                })
            );
    }
}