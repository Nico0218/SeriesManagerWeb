import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppConfig } from '../classes/app-config';
import { Environment } from '../classes/environment';

@Injectable()
export class ConfigService {
    constructor(private httpClient: HttpClient) {
    }

    public loadAppsettings(): Promise<any> {
        return this.httpClient.get("../../assets/appsettings.json").pipe(
            map((result: AppConfig) => {
                Environment.apiUrl = result.apiUrl;
                Environment.production = result.production;
                console.log(result);
                return of(result)
            })).toPromise();
    }

    // loadConfigurationData(): Promise<Configuration> {
    //     return this.http.get<Configuration>(`${this.originUrl}${this.configUrlPath}`)
    //     .do(result => {
    //       this.configData = result;
    //     })
    //     .toPromise();
    //   }
}