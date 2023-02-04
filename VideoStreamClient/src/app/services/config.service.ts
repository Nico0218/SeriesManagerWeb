import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from '../classes/app-config';
import { FolderLibrary } from '../classes/config/folder-library';
import { MainConfig } from '../classes/config/main-config';
import { Environment } from '../classes/environment';

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

    public loadAppSettings(): Promise<AppConfig> {
        return firstValueFrom(this.httpClient.get(this.applicationPath + "assets/appsettings.json")
            .pipe(
                map((result: unknown) => {
                    const appConfig = result as AppConfig;
                    Environment.apiUrl = appConfig.apiUrl;
                    Environment.production = appConfig.production;
                    return appConfig;
                })
            )
        );
    }

    public IsConfigured(): Observable<boolean> {
        return this.httpClient.get(`${this.controllerURL}/IsConfigured`)
            .pipe(
                map((ii: unknown) => {
                    return ii as boolean;
                })
            );
    }

    public GetConfig(): Observable<MainConfig> {
        return this.httpClient.get(`${this.controllerURL}/GetConfig`)
            .pipe(
                map((ii: unknown) => {
                    return ii as MainConfig;
                })
            );
    }

    public SaveConfig(mainConfig: MainConfig): Observable<boolean> {
        return this.httpClient.post(`${this.controllerURL}/SaveConfig`, mainConfig)
            .pipe(
                map((ii: unknown) => {
                    return ii as boolean;
                })
            );
    }

    public GetFolders(): Observable<FolderLibrary[]> {
        return this.httpClient.get(`${this.controllerURL}/GetFolders`)
            .pipe(
                map((ii: unknown) => {
                    return ii as FolderLibrary[];
                })
            );
    }

    public SaveFolders(folders: FolderLibrary[]): Observable<boolean> {
        return this.httpClient.post(`${this.controllerURL}/SaveFolders`, folders)
            .pipe(
                map((ii: unknown) => {
                    return ii as boolean;
                })
            );
    }
}