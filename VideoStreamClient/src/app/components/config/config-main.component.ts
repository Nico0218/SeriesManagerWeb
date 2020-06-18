import { Component, OnInit } from '@angular/core';
import { UIBase } from '../common/ui-base-component/ui-base.component';

@Component({
    selector: 'config-main-component',
    templateUrl: './config-main.component.html',
    styleUrls: ['./config-main.component.scss']
})
export class ConfigMainComponent extends UIBase implements OnInit {

    constructor() {
        super();

    }

    ngOnInit(): void {
        this.loadBreadcrumb();
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
}