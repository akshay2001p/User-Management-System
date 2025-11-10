import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private storage: StorageService) {}

  register(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.accessToken) {
          this.storage.setToken(response.accessToken);
        }
      })
    );
  }

  setPassword(password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/set-password`, { password, confirmPassword });
  }

  logout(): void {
    this.storage.removeToken();
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/user/profile`);
  }
}