import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UIBase } from '../common/ui-base-component/ui-base.component';

@Component({
    selector: 'missing-page-component',
    templateUrl: './missing-page.component.html',
    styleUrls: ['./missing-page.component.scss']
})
export class MissingPageComponent extends UIBase implements OnInit {
    constructor(private router: Router) {
        super(router.config);
        
    }

    ngOnInit(): void {
        this.loadBreadcrumb();
    }

    private loadBreadcrumb() {
        this.AddBreadCrumbItem("Home");
    }
}