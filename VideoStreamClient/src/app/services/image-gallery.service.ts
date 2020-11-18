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

    GetAll(): Observable<ImageGallery[]> {
        return this.httpClient.get(`${this.controllerURL}/GetAll`)
            .pipe(
                map((ii: ImageGallery[]) => {
                    return ii;
                })
            );
    }

    GetByID(GalleryID: string): Observable<ImageGallery> {
        return this.httpClient.get(`${this.controllerURL}/GetByID/${GalleryID}`)
            .pipe(
                map((ii: ImageGallery) => {
                    return ii;
                })
            );
    }

    GetByName(GalleryName: string): Observable<ImageGallery> {
        return this.httpClient.get(`${this.controllerURL}/GetByName/${GalleryName}`)
            .pipe(
                map((ii: ImageGallery) => {
                    return ii;
                })
            );
    }
}