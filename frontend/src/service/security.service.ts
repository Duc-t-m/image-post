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
    private jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient) { }

    login(user: UserDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, user, { responseType: 'text' });
    }

    logout() {
        localStorage.removeItem('token');
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !this.jwtHelper.isTokenExpired(token);
    }

}