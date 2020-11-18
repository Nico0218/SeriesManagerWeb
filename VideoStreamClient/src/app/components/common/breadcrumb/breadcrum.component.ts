import { Component, Input } from '@angular/core';
import { BreadcrumbItem } from '../../../classes/breadcrumb-item';
import { faUserCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
    selector: 'breadcrum-component',
    templateUrl: './breadcrum.component.html',
    styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent {
    faUserCog = faUserCog
    faSignOutAlt = faSignOutAlt

    @Input() breadcrumbItems: BreadcrumbItem[];
    constructor(private authenticationService: AuthenticationService) {

    }

    public Logout() {
        this.authenticationService.logout();
    }
}