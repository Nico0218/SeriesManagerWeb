import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AppConfig } from '../classes/app-config';
import { Environment } from '../classes/environment';

@Injectable()
export class ConfigService {
    constructor(private httpClient: HttpClient) {
    }
    
    public get controllerURL() : string {
        return `${Environment.apiUrl}/Config`;
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

    public IsConfigured(): Observable<boolean> {
        return this.httpClient.get(`${this.controllerURL}/IsConfigured`)
            .pipe(
                map((ii: boolean) => {
                    return ii;
                })
            );
    }
}