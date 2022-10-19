import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'login-component',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: UntypedFormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private configService: ConfigService
    ) {
        this.loading = true;
        // redirect to home if already logged in
        if (this.authenticationService.userValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.loading = false;
    }

    // convenience getter for easy access to form fields
    get formField() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (!this.formField.username.value)
            this.formField.username.setValue("admin");
        if (!this.formField.password.value)
            this.formField.password.setValue("admin");

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.formField.username.value, this.formField.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.configService.IsConfigured()
                        .pipe(
                            tap(isConfigured => {
                                if (isConfigured) {
                                    this.router.navigate([this.returnUrl]);
                                } else {
                                    this.router.navigate(["/settings"]);
                                }
                            })
                        )
                        .subscribe();
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}