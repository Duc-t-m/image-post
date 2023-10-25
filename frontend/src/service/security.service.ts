import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDTO } from '../model/user.type';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    apiUrl = 'http://localhost:8080';

    constructor(
        private http: HttpClient,
        private jwtHelper: JwtHelperService
    ) { }

    login(user: UserDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, user, { responseType: 'text' });
    }

    isAuthenticated() {
        const token = this.jwtHelper.tokenGetter();
        return !!token && !this.jwtHelper.isTokenExpired(token.toString());
    }

    loginRequestSuccess(token: string) {
        localStorage.setItem('token', token);
    }

    logout() {
        localStorage.removeItem('token');
    }

}