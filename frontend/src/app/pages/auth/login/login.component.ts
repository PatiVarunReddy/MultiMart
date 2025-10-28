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

        <div style="margin-bottom:1rem;">
          <label><input type="radio" name="mode" [checked]="!otpMode" (change)="setMode('password')"> Password</label>
          <label style="margin-left:1rem;"><input type="radio" name="mode" [checked]="otpMode" (change)="setMode('otp')"> OTP</label>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" *ngIf="!otpMode">
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

        <div *ngIf="otpMode">
          <div class="form-group">
            <label>Email or Phone (+91)</label>
            <input type="text" [(ngModel)]="identifier" name="identifier" class="form-control" placeholder="you@example.com or 9123456789" autocomplete="email">
          </div>

          <div *ngIf="!otpSent">
        <button class="btn btn-secondary" (click)="requestOtp()" [disabled]="otpRequesting">{{otpRequesting ? 'Requesting...' : 'Request OTP'}}</button>
          </div>

          <div *ngIf="otpSent" style="margin-top:1rem;">
            <div class="form-group">
              <label>Enter OTP</label>
              <input type="text" [(ngModel)]="otpCode" name="otpCode" class="form-control" placeholder="6-digit code">
            </div>
            <button class="btn btn-primary" (click)="verifyOtp()" [disabled]="verifying">{{verifying ? 'Verifying...' : 'Verify & Login'}}</button>
          </div>
        </div>

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
  // OTP flow state
  otpMode = false;
  identifier = '';
  otpSent = false;
  otpRequesting = false;
  otpCode = '';
  verifying = false;

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

  setMode(mode: 'password' | 'otp') {
    this.otpMode = mode === 'otp';
    this.error = '';
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
          // Store email temporarily for OTP verification
          localStorage.setItem('loginEmail', email);
          // Redirect to OTP verification page
          this.router.navigate(['/verify-otp']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  requestOtp(): void {
    if (!this.identifier) {
      this.error = 'Please enter email or phone number';
      return;
    }
    this.otpRequesting = true;
    this.error = '';
    this.authService.requestOtp(this.identifier).subscribe({
      next: (res) => {
        this.otpRequesting = false;
        if (res.success) {
          this.otpSent = true;
        } else {
          this.error = res.message || 'Failed to request OTP';
        }
      },
      error: (err) => {
        this.otpRequesting = false;
        this.error = err.error?.message || 'Failed to request OTP';
      }
    });
  }

  verifyOtp(): void {
    if (!this.otpCode) {
      this.error = 'Please enter the OTP code';
      return;
    }
    this.verifying = true;
    this.error = '';
    this.authService.verifyOtp(this.identifier, this.otpCode).subscribe({
      next: (res) => {
        this.verifying = false;
        if (res.success) {
          const user = res.data;
          this.cartService.loadCartCount();
          if (user.role === 'vendor') {
            this.router.navigate(['/vendor/dashboard']);
          } else if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.error = res.message || 'Verification failed';
        }
      },
      error: (err) => {
        this.verifying = false;
        this.error = err.error?.message || 'Verification failed';
      }
    });
  }
}
