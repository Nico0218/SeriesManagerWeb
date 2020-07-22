import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConfigGuard implements CanActivate {
    constructor(private router: Router,
        private configService: ConfigService) {

    }

    async canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const isConfigured = await this.configService.IsConfigured().pipe(first()).toPromise();
        if (isConfigured === true) {
            return true;
        }
        this.router.navigate(['settings']);
        return false;
    }
}