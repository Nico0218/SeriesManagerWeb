import { Component, OnInit } from '@angular/core';
import { UIBase } from '../common/ui-base-component/ui-base.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';
import { MainConfig } from 'src/app/classes/config/main-config';
import { tap, first, catchError, map } from 'rxjs/operators';
import { FolderLibrary } from 'src/app/classes/config/folder-library';
import { FolderType } from 'src/app/enums/config/folder-type';
import { ObjectStatus } from 'src/app/enums/config/object-status';

@Component({
    selector: 'config-main-component',
    templateUrl: './config-main.component.html',
    styleUrls: ['./config-main.component.scss']
})
export class ConfigMainComponent extends UIBase implements OnInit {
    settingsForm: FormGroup;
    submitted = false;
    loading = false;
    saving = false;
    error = '';
    mainConfig: MainConfig;
    folders: FolderLibrary[];

    constructor(private formBuilder: FormBuilder, private configService: ConfigService) {
        super();

    }

    async ngOnInit(): Promise<void> {
        this.loadBreadcrumb();
        this.loading = true;
        await this.loadMainConfig();
        await this.loadConfiguredFolders();

        this.settingsForm = this.formBuilder.group({
            ingestFolder: new FormControl('', Validators.required)
        });
        this.settingsForm.patchValue({
            ingestFolder: this.folders.find(ii => ii.fileType == FolderType.Ingest).basePath
        });
        this.loading = false;
    }

    private async loadConfiguredFolders() {
        await this.configService.GetFolders()
            .pipe(
                tap(ii => {
                    if (ii)
                        this.folders = ii;
                    else
                        this.folders = [];
                }),
                first()
            ).toPromise();
    }

    private async loadMainConfig() {
        await this.configService.GetConfig()
            .pipe(
                tap(ii => {
                    if (ii)
                        this.mainConfig = ii
                    else {
                        this.mainConfig = new MainConfig();
                    }
                }),
                first()
            ).toPromise();
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
        this.saving = true;
        this.mainConfig.isConfigured = true;
        var ingestLib: FolderLibrary = this.folders.find(ii => ii.name === "IngestFolder");
        if (ingestLib.basePath != this.formField["ingestFolder"].value) {
            ingestLib.basePath = this.formField["ingestFolder"].value;
            ingestLib.status = ObjectStatus.Modified;
        }

        this.configService.SaveFolders(this.folders)
            .pipe(
                map(ii => {
                    this.UpdateConfig();
                }),
                catchError(ii => {
                    this.error = ii
                    this.saving = false;
                    return ii;
                })
            )
            .subscribe();

    }

    private UpdateConfig() {
        this.configService.SaveConfig(this.mainConfig)
            .pipe(
                map(ii => {
                    this.saving = false;
                }),
                catchError(ii => {
                    this.error = ii
                    this.saving = false;
                    return ii;
                })
            )
            .subscribe();
    }

    // convenience getter for easy access to form fields
    get formField() { return this.settingsForm.controls; }
}