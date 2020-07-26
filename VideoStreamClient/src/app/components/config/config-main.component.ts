import { Component, OnInit } from '@angular/core';
import { UIBase } from '../common/ui-base-component/ui-base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { MainConfig } from 'src/app/classes/config/main-config';
import { tap, first, catchError, map } from 'rxjs/operators';
import { FolderLibrary } from 'src/app/classes/config/folder-library';

@Component({
    selector: 'config-main-component',
    templateUrl: './config-main.component.html',
    styleUrls: ['./config-main.component.scss']
})
export class ConfigMainComponent extends UIBase implements OnInit {
    settingsForm: FormGroup;
    submitted = false;
    loading = false;
    error = '';
    mainConfig: MainConfig;
    folders: FolderLibrary[];

    constructor(private formBuilder: FormBuilder, private configService: ConfigService) {
        super();

    }

    ngOnInit(): void {
        this.loadBreadcrumb();

        this.configService.GetConfig()
            .pipe(
                tap(ii => {
                    if (ii)
                        this.mainConfig = ii
                    else {
                        this.mainConfig = new MainConfig();
                    }
                }),
                first()
            )
            .subscribe();

        this.configService.GetFolders()
            .pipe(
                tap(ii => {
                    if (ii)
                        this.folders = ii;
                    else
                        this.folders = [];
                }),
                first()
            )
            .subscribe();

        this.settingsForm = this.formBuilder.group({
            ingestFolder: ['', Validators.required]
        });
    }

    private loadBreadcrumb() {
        this.breadcrumbItems = [
            {
                id: 'Home',
                label: 'Home',
                path: '/home'
            },
            {
                id: 'Settings',
                label: 'Settings',
                path: '/settings'
            }
        ];
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.settingsForm.invalid) {
            return;
        }
        this.loading = true;
        this.mainConfig.isConfigured = true;

        this.configService.SaveFolders(this.folders)
            .pipe(
                map(ii => {
                    this.UpdateConfig();
                }),
                catchError(ii => this.error = ii)
            )
            .subscribe();

    }

    private UpdateConfig() {
        this.configService.SaveConfig(this.mainConfig)
            .pipe(
                map(ii => {
                    this.loading = false;
                }),
                catchError(ii => this.error = ii)
            )
            .subscribe();
    }

    // convenience getter for easy access to form fields
    get formField() { return this.settingsForm.controls; }
}