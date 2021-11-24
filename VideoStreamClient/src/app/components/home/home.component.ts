import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from '../../classes/security/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UIBase } from '../common/ui-base-component/ui-base.component';

@Component({
    selector: 'home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends UIBase implements OnInit {
    user: User;

    constructor(private authenticationService: AuthenticationService,
        private router: Router) {
        super(router.config);
        this.loading = true;
        this.user = authenticationService.userValue;
    }

    ngOnInit(): void {
        this.loadBreadcrumb();
        this.loading = false;
    }

    private loadBreadcrumb() {
        this.AddBreadCrumbItem("Home");
    }
}