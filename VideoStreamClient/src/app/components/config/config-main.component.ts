import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, first, map, takeUntil, tap } from 'rxjs/operators';
import { FolderLibrary } from '../../classes/config/folder-library';
import { MainConfig } from '../../classes/config/main-config';
import { ObjectStatus } from '../../enums/config/object-status';
import { Guid } from '../../helpers/guid';
import { ConfigService } from '../../services/config.service';
import { UIBase } from '../common/ui-base-component/ui-base.component';

@Component({
    selector: 'config-main-component',
    templateUrl: './config-main.component.html',
    styleUrls: ['./config-main.component.scss']
})
export class ConfigMainComponent extends UIBase implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    form: FormGroup = new FormGroup({});
    submitted = false;
    loading = true;
    saving = false;
    error = '';
    mainConfig: MainConfig;
    model = {
        folders: FolderLibrary[0]
    };
    oldModel = this.model;
    fields: FormlyFieldConfig[];

    constructor(private configService: ConfigService, 
        private router: Router) {
        super(router.config);
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    async ngOnInit(): Promise<void> {
        this.loadBreadcrumb();
        this.loading = true;
        await this.loadMainConfig();
        await this.loadConfiguredFolders();
        this.buildFieldConfig();
        this.oldModel = JSON.parse(JSON.stringify(this.model))

        this.form.valueChanges.pipe(
            debounceTime(500),
            tap(() => {
                if (this.model.folders && this.oldModel) {
                    (this.model.folders as FolderLibrary[]).forEach(newFolder => {
                        const oldFolderIndex = (this.oldModel.folders as FolderLibrary[]).findIndex(ii => ii.id == newFolder.id);
                        if (oldFolderIndex == -1) {
                            newFolder.status = ObjectStatus.Created;
                            if (newFolder.displayName) {
                                newFolder.name = newFolder.displayName.replace(" ", "");
                                newFolder.id = Guid.newGuid();
                                this.oldModel.folders.push(newFolder);
                            }
                        } else if (JSON.stringify(newFolder) != JSON.stringify(this.oldModel.folders[oldFolderIndex])) {
                            newFolder.status = ObjectStatus.Modified;
                            this.oldModel.folders[oldFolderIndex] = newFolder;
                        }
                    });
                    (this.oldModel.folders as FolderLibrary[]).forEach(oldFolder => {
                        var newFolder = (this.model.folders as FolderLibrary[]).find(ii => ii.id == oldFolder.id);
                        if (newFolder == null) {
                            oldFolder.status = ObjectStatus.Deleted;
                        }
                    });
                }
            }),
            takeUntil(this.destroyed$)
        ).subscribe();

        this.loading = false;
    }

    private buildFieldConfig() {
        this.fields = [
            {
                key: 'folders',
                type: 'repeat',
                templateOptions: {
                    addText: 'Add another library locaton',
                },
                fieldArray: {
                    fieldGroup: [
                        {
                            type: 'input',
                            key: 'displayName',
                            className: 'custom-col',
                            templateOptions: {
                                label: 'Folder Name:',
                                required: true,
                            }
                        },
                        {
                            className: 'custom-col',
                            type: 'input',
                            key: 'basePath',
                            templateOptions: {
                                label: 'Folder Directory:',
                                required: true,
                            },
                        },
                        {
                            className: 'custom-col',
                            type: 'select',
                            key: 'fileType',
                            templateOptions: {
                                label: 'Folder Type:',
                                required: true,
                                options: [
                                    { value: 0, label: 'UnknownFile' },
                                    { value: 1, label: 'VideoFile' },
                                    { value: 2, label: 'ImageFile' },
                                    { value: 3, label: 'Interim' },
                                    { value: 4, label: 'Ingest' },
                                    { value: 5, label: 'ImageReject' },
                                    { value: 6, label: 'VideoReject' },
                                ],
                            },
                        },
                    ],
                },
            },
        ];
    }

    private async loadConfiguredFolders() {
        await this.configService.GetFolders()
            .pipe(
                tap(ii => {
                    if (ii)
                        this.model.folders = ii;
                    else
                        this.model.folders = [];
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
        this.AddBreadcrumItem("Home");
        this.AddBreadcrumItem("ConfigMain");
    }

    test: Observable<any>;
    modelChange() {

    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.saving = true;
        this.mainConfig.isConfigured = true;

        this.configService.SaveFolders(this.oldModel.folders)
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
                    (this.model.folders as FolderLibrary[]).forEach(folder => {
                        folder.status = ObjectStatus.None;
                    });
                    this.oldModel = JSON.parse(JSON.stringify(this.model));
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
}