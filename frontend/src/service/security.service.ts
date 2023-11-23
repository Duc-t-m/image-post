import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginDTO, SignUpDTO} from '../model/user.type';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient
  ) {
  }

  login(account: LoginDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, account, {responseType: 'text'});
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  authenticationSuccess(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  signUp(account: SignUpDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, account, {responseType: 'text'});
  }

  checkFieldExists(field: string, value: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check/${field}`, value);
  }
}
