import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../classes/app-config';

@Injectable()
export class ConfigService {
    private AppConfig: AppConfig = {
        CoreURL: "http://STALKER-PC:5000"
    };

    constructor(private httpClient: HttpClient) {
    }

    public GetAppConfig(): AppConfig {
        return this.AppConfig;
        // if (this.AppConfig)
        //     return this.AppConfig;
        // else {
        //     this.AppConfig = await this.httpClient.get("../../assets/appsettings.json")
        //         .pipe(
        //             map((ii: AppConfig) => {
        //                 return ii;
        //             }),
        //             take(1)
        //         )
        //         .toPromise();
        //     return this.AppConfig;
        // }
    }
}