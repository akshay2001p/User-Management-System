import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auth.login(email, password).subscribe({
        next: (response) => {
          localStorage.setItem('isFirstLogin', response.isFirstLogin.toString());
          if (response.role === 'admin') {
            this.router.navigate(['/admin/users']);
          } else {
            this.router.navigate(response.isFirstLogin ? ['/user/set-password'] : ['/user/home']);
          }
        },
        error: (err) => {
          this.errorMessage = 'Invalid credentials. Check email/password.';
          console.error('Login failed:', err);
        }
      });
    }
  }
}