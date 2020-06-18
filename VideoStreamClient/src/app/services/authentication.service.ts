import { Injectable } from '@angular/core';
import { User } from '../classes/security/user';
import { UserRoles } from '../enums/security/user-roles';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../classes/environment';
import { map } from 'rxjs/operators';
import { LoginRequest } from '../classes/security/login-request';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(private router: Router,
        private http: HttpClient) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public login(username: string, password: string) {
        //Password should be encrypted at this point
        let loginRequest: LoginRequest = { userName : username, password: password};
        return this.http.post<any>(`${Environment.apiUrl}/User/authenticate`, loginRequest)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}