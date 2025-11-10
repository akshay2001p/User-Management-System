import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.html',
  styleUrls: ['./set-password.css'],
  standalone: false
})
export class SetPasswordComponent {
  passwordForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordPatternValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordPatternValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return hasUpper && hasLower && hasNumber && hasSpecial ? null : { invalidPattern: true };
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { password, confirmPassword } = this.passwordForm.value;
      this.errorMessage = '';
      this.successMessage = '';
      
      this.auth.setPassword(password, confirmPassword).subscribe({
        next: () => {
          this.successMessage = 'Password set successfully!';
          localStorage.removeItem('isFirstLogin');
          setTimeout(() => this.router.navigate(['/user/home']), 1500);
        },
        error: (err) => {
          console.error('Password set failed:', err);
          this.errorMessage = err?.error?.message || 'Failed to set password. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fix the form errors before submitting.';
    }
  }
}