import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { firstValueFrom } from "rxjs";
import { map } from "rxjs/operators";
import { Environment } from "../classes/environment";
import { SubtitlesWrapper } from "../classes/Models/subtitles-wrapper";

@Injectable()
export class VideoStreamService {
  constructor(
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer
  ) { }

  public get controllerURL(): string {
    return `${Environment.apiUrl}/VideoStream`;
  }

  GetVideoStream(videoID: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(
      `${this.controllerURL}/GetVideoStream/${videoID}`
    );
  }

  async GetVideoSubtitles(videoID: string): Promise<SubtitlesWrapper[]> {
    this.domSanitizer.bypassSecurityTrustResourceUrl;
    return await firstValueFrom(this.httpClient
      .get(`${this.controllerURL}/GetVideoSubtitles/${videoID}`)
      .pipe(
        map((ii: any) => ii as SubtitlesWrapper[]),
        map((ii) => {
          let safeSubs: SubtitlesWrapper[] = [];
          ii.forEach((subs) => {
            let subtitlesWrapper = {} as SubtitlesWrapper;
            subtitlesWrapper.title = subs.title;
            subtitlesWrapper.language = subs.language;
            let res = `data:text/plain;base64,${subs.data}`;
            subtitlesWrapper.data = this.domSanitizer.bypassSecurityTrustUrl(res);
            safeSubs.push(subtitlesWrapper);
          });
          return safeSubs;
        })
      ));
  }
}
