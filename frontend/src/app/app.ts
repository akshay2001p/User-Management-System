import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from './services/storage';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;
  private jwtHelper = new JwtHelperService();

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    this.isLoggedIn = this.storage.isLoggedIn();
    
    if (this.isLoggedIn) {
      const token = this.storage.getToken();
      if (token) {
        const decoded = this.jwtHelper.decodeToken(token);
        this.userRole = decoded?.role || null;
      }
    } else {
      this.userRole = null;
    }
  }
}
