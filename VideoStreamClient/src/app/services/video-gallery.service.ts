import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { SeriesInformation } from '../classes/Models/series-information';
import { Video } from '../classes/Models/Video';

@Injectable()
export class VideoGalleryService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    GetAllSeries(): Observable<SeriesInformation[]> {
        return this.httpClient.get(`${Environment.apiUrl}/VideoGallery/GetAllSeries`)
            .pipe(
                map((ii: SeriesInformation[]) => {
                    return ii;
                })
            );
    }

    GetSeriesByID(SeriesID: string): Observable<SeriesInformation> {
        return this.httpClient.get(`${Environment.apiUrl}/VideoGallery/GetSeriesByID/${SeriesID}`)
            .pipe(
                map((ii: SeriesInformation) => {
                    return ii;
                })
            );
    }

    GetSeriesByName(SeriesName: string): Observable<SeriesInformation> {
        return this.httpClient.get(`${Environment.apiUrl}/VideoGallery/GetSeriesByName/${SeriesName}`)
            .pipe(
                map((ii: SeriesInformation) => {
                    return ii;
                })
            );
    }

    GetEpisodesForSeries(SeriesID: string): Observable<Video[]> {
        return this.httpClient.get(`${Environment.apiUrl}/VideoGallery/GetEpisodesForSeries/${SeriesID}`)
            .pipe(
                map((ii: Video[]) => {
                    return ii;
                })
            );
    }
}