import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../classes/Models/Video';
import { Environment } from '../classes/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class VideoStreamService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    public get controllerURL(): string {
        return `${Environment.apiUrl}/VideoStream`;
    }

    GetVideoStream(videoID: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(`${this.controllerURL}/GetVideoStream/${videoID}`);
    }

    async GetVideoSubtitles(videoID: string): Promise<SafeUrl> {
        this.domSanitizer.bypassSecurityTrustResourceUrl
        return await this.httpClient.get(`${this.controllerURL}/GetVideoSubtitles/${videoID}`)
            .pipe(
                map((ii: any) => {
                    let res = `data:text/plain;base64,${ii.data}`;
                    return this.domSanitizer.bypassSecurityTrustUrl(res);
                })
            ).toPromise();
    }
}