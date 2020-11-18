import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { VideoGallery } from '../classes/Models/video-gallery';

@Injectable()
export class VideoGalleryService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    public get controllerURL() : string {
        return `${Environment.apiUrl}/VideoGallery`;
    }

    GetAll(): Observable<VideoGallery[]> {
        return this.httpClient.get(`${this.controllerURL}/GetAll`)
            .pipe(
                map((ii: VideoGallery[]) => {
                    return ii;
                })
            );
    }

    GetByID(GalleryID: string): Observable<VideoGallery> {
        return this.httpClient.get(`${this.controllerURL}/GetByID/${GalleryID}`)
            .pipe(
                map((ii: VideoGallery) => {
                    return ii;
                })
            );
    }

    GetByName(GalleryName: string): Observable<VideoGallery> {
        return this.httpClient.get(`${this.controllerURL}/GetByName/${GalleryName}`)
            .pipe(
                map((ii: VideoGallery) => {
                    return ii;
                })
            );
    }
}