import { Component, OnInit } from '@angular/core';
import { UIBase } from '../common/ui-base-component/ui-base.component';

@Component({
    selector: 'home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends UIBase implements OnInit {

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