import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { Video } from '../classes/Models/Video';

@Injectable()
export class VideoService {
    constructor(private httpClient: HttpClient) {
    }

    public get controllerURL() : string {
        return `${Environment.apiUrl}/Video`;
    }

    GetByGallery(GalleryID: string): Observable<Video[]> {
        return this.httpClient.get(`${this.controllerURL}/GetByGallery/${GalleryID}`)
            .pipe(
                map((ii: Video[]) => {
                    return ii;
                })
            );
    }

    GetCountByGallery(GalleryID: string): Observable<number> {
        return this.httpClient.get(`${this.controllerURL}/GetCountByGallery/${GalleryID}`)
            .pipe(
                map((ii: number) => {
                    return ii;
                })
            );
    }

    GetByPage(GalleryID: string, PageNo: number, PageSize: number): Observable<Video[]> {
        return this.httpClient.get(`${this.controllerURL}/GetByPage/${GalleryID}/${PageNo}/${PageSize}`)
            .pipe(
                map((ii: Video[]) => {
                    return ii;
                })
            );
    }
}