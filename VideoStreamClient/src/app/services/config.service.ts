import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AppConfig } from '../classes/app-config';
import { Environment } from '../classes/environment';
import { MainConfig } from '../classes/config/main-config';
import { FolderLibrary } from '../classes/config/folder-library';
import { APP_BASE_HREF } from '@angular/common';

@Injectable()
export class ConfigService {
    applicationPath = "../../";
    constructor(private httpClient: HttpClient, @Inject(APP_BASE_HREF) baseHref: string) {
        if (baseHref && baseHref != '/') {
            this.applicationPath = baseHref;
        }
    }

    public get controllerURL(): string {
        return `${Environment.apiUrl}/Config`;
    }

    public loadAppsettings(): Promise<any> {
        return this.httpClient.get(this.applicationPath + "assets/appsettings.json").pipe(
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

    public GetConfig(): Observable<MainConfig> {
        return this.httpClient.get(`${this.controllerURL}/GetConfig`)
            .pipe(
                map((ii: MainConfig) => {
                    return ii;
                })
            );
    }

    public SaveConfig(mainConfig: MainConfig): Observable<boolean> {
        return this.httpClient.post(`${this.controllerURL}/SaveConfig`, mainConfig)
            .pipe(
                map((ii: boolean) => {
                    return ii;
                })
            );
    }

    public GetFolders(): Observable<FolderLibrary[]> {
        return this.httpClient.get(`${this.controllerURL}/GetFolders`)
            .pipe(
                map((ii: FolderLibrary[]) => {
                    return ii;
                })
            );
    }

    public SaveFolders(folders): Observable<boolean> {
        return this.httpClient.post(`${this.controllerURL}/SaveFolders`, folders)
            .pipe(
                map((ii: boolean) => {
                    return ii;
                })
            );
    }
}