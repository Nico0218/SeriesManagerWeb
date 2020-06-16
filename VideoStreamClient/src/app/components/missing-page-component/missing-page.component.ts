import { Component, OnInit } from '@angular/core';
import { UIBase } from '../common/ui-base-component/ui-base.component';

@Component({
    selector: 'missing-page-component',
    templateUrl: './missing-page.component.html',
    styleUrls: ['./missing-page.component.scss']
})
export class MissingPageComponent extends UIBase implements OnInit {
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
            }
        ];
    }
}