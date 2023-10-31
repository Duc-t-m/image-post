import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserLoginDTO, UserSignUpDTO } from '../model/user.type';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    apiUrl = 'http://localhost:8080';

    constructor(
        private http: HttpClient,
        private jwtHelper: JwtHelperService
    ) { }

    login(account: UserLoginDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, account, { responseType: 'text' });
    }

    isAuthenticated() {
        const token = this.jwtHelper.tokenGetter();
        return !!token && !this.jwtHelper.isTokenExpired(token.toString());
    }

    authenticationSuccess(token: string) {
        localStorage.setItem('token', token);
    }

    logout() {
        localStorage.removeItem('token');
    }

    signUp(account: UserSignUpDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/sign-up`, account, { responseType: 'text' });
    }

    checkFieldExists(field: string, value: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/check/${field}`, value);
    }
}
