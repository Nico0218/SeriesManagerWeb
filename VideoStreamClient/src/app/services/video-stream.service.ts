import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../classes/Models/Video';
import { Environment } from '../classes/environment';

@Injectable()
export class VideoStreamService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer) {
    }

    GetVideoStream(video: Video): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(`${Environment.apiUrl}/VideoStream/GetVideoStream/${video.id}`);
    }
}