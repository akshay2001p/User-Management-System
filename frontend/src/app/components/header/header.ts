import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../services/storage';  

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
    
    // Update login status on every route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.storage.isLoggedIn();
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}