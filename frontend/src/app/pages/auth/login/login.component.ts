import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container" style="max-width: 520px; margin-top: 3rem;">
      <div class="card">
        <h2>Login</h2>

        <div *ngIf="error" class="alert alert-error">{{error}}</div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="Enter your email"
              autocomplete="email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Enter your password"
              autocomplete="current-password">
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || loading">
            {{loading ? 'Logging in...' : 'Login'}}
          </button>
        </form>

        <p style="margin-top: 1rem;">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.cartService.loadCartCount();
          const user = response.data;
          if (user.role === 'vendor') {
            this.router.navigate(['/vendor/dashboard']);
          } else if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
