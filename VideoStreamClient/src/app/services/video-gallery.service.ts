import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeriesInformation } from '../classes/Models/series-information';
import { ConfigService } from './config.service';
import { Video } from '../classes/Models/Video';

@Injectable()
export class VideoGalleryService {
    constructor(private httpClient: HttpClient,
        private configService: ConfigService,
        private domSanitizer: DomSanitizer) {
    }

    GetAllSeries(): Observable<SeriesInformation[]> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/VideoGallery/GetAllSeries`)
            .pipe(
                map((ii: SeriesInformation[]) => {
                    return ii;
                })
            );
    }

    GetSeriesByID(SeriesID: string): Observable<SeriesInformation> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/VideoGallery/GetSeriesByID/${SeriesID}`)
            .pipe(
                map((ii: SeriesInformation) => {
                    return ii;
                })
            );
    }

    GetSeriesByName(SeriesName: string): Observable<SeriesInformation> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/VideoGallery/GetSeriesByName/${SeriesName}`)
            .pipe(
                map((ii: SeriesInformation) => {
                    return ii;
                })
            );
    }

    GetEpisodesForSeries(SeriesID: string): Observable<Video[]> {
        return this.httpClient.get(`${this.configService.GetAppConfig().CoreURL}/VideoGallery/GetEpisodesForSeries/${SeriesID}`)
            .pipe(
                map((ii: Video[]) => {
                    return ii;
                })
            );
    }
}