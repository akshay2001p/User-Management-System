import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  loading = true;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.loading = false;
      }
    });
  }
}