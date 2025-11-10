import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../services/storage';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private jwtHelper = new JwtHelperService();

  constructor(private storage: StorageService, private router: Router) {}

  canActivate(): boolean {
    const token = this.storage.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.storage.removeToken();
      this.router.navigate(['/auth/login']);
      return false;
    }
    const decoded = this.jwtHelper.decodeToken(token);
    if (decoded?.role === 'admin') return true;
    this.router.navigate(['/user/home']);
    return false;
  }
}