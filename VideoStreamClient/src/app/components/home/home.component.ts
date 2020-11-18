import { Component, OnInit } from '@angular/core';
import { UIBase } from '../common/ui-base-component/ui-base.component';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../classes/security/user';

@Component({
    selector: 'home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends UIBase implements OnInit {
    user: User;

    constructor(private authenticationService: AuthenticationService) {
        super();        
        this.user = authenticationService.userValue;
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