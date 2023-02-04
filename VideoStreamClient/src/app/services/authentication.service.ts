import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../classes/environment';
import { LoginRequest } from '../classes/security/login-request';
import { User } from '../classes/security/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject?: BehaviorSubject<User | undefined>;
    public user?: Observable<User | undefined>;

    constructor(private router: Router,
        private http: HttpClient) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr) as User;
            if (this.userSubject) {
                this.userSubject = new BehaviorSubject<User | undefined>(user);
                this.user = this.userSubject.asObservable();
            }
        } else {
            console.error(`User has not been set`);
        }
    }

    public get controllerURL(): string {
        return `${Environment.apiUrl}/User`;
    }

    public get userValue(): User {
        if (this.userSubject && this.userSubject.value) {
            return this.userSubject.value;
        }
        throw new Error("UserSubject has not been set.");
    }

    public login(username: string, password: string) {
        //Password should be encrypted at this point
        let loginRequest: LoginRequest = { userName: username, password: password };
        console.log(Environment.apiUrl);
        return this.http.post<any>(`${this.controllerURL}/authenticate`, loginRequest)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                if (this.userSubject) {
                    this.userSubject.next(user);
                    return user;
                }
                throw new Error("userSubject has not been set");
            }));
    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        if (this.userSubject) {
            this.userSubject.next(undefined);
            this.router.navigate(['/login']);
        }
        throw new Error("userSubject has not been set");
    }
}