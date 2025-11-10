import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ForcePasswordResetGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
    if (isFirstLogin) return true;
    this.router.navigate(['/user/home']);
    return false;
  }
}