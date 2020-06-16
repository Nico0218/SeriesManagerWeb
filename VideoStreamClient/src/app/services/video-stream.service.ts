import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Video } from '../classes/Models/Video';
import { ConfigService } from './config.service';

@Injectable()
export class VideoStreamService {
    constructor(private httpClient: HttpClient,
        private domSanitizer: DomSanitizer,
        private configService: ConfigService) {
    }

    GetVideoStream(video: Video): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(`${this.configService.GetAppConfig().CoreURL}/VideoStream/GetVideoStream/${video.id}`);
    }
}