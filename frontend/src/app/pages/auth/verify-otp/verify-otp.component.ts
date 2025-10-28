import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width: 520px; margin-top: 3rem;">
      <div class="card">
        <h2>Verify OTP</h2>
        
        <div *ngIf="error" class="alert alert-error">{{error}}</div>
        <div *ngIf="success" class="alert alert-success">{{success}}</div>

        <div *ngIf="otpSent" class="form-group">
          <p style="margin-bottom: 1rem; color: #666;">We've sent an OTP to <strong>{{email}}</strong></p>
          <p style="font-size: 0.9rem; color: #999;">Didn't receive the code? <button type="button" (click)="resendOtp()" class="btn-link">Resend</button></p>
        </div>

        <div class="form-group">
          <label>Enter OTP Code</label>
          <input 
            type="text" 
            [(ngModel)]="otpCode" 
            name="otpCode" 
            class="form-control" 
            placeholder="Enter 6-digit code"
            maxlength="6"
            inputmode="numeric">
        </div>

        <button type="button" class="btn btn-primary" (click)="verifyOtp()" [disabled]="verifying || !otpCode || otpCode.length !== 6">
          {{verifying ? 'Verifying...' : 'Verify & Login'}}
        </button>

        <p style="margin-top: 1.5rem; text-align: center;">
          <button type="button" (click)="goBack()" class="btn-link">Back to Login</button>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 0 1rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: monospace;
      letter-spacing: 0.1em;
    }

    .form-control:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4338ca;
    }

    .btn-primary:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    .btn-link {
      background: none;
      border: none;
      color: #4f46e5;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
      font: inherit;
    }

    .btn-link:hover {
      color: #4338ca;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    .alert-success {
      background: #efe;
      color: #3c3;
      border: 1px solid #cfc;
    }

    p {
      margin: 0;
    }
  `]
})
export class VerifyOtpComponent implements OnInit {
  email: string = '';
  otpCode: string = '';
  otpSent: boolean = false;
  verifying: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Get email from localStorage (set during login)
    this.email = localStorage.getItem('loginEmail') || '';
    
    if (!this.email) {
      this.error = 'Email not found. Please login again.';
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }

    // Auto-request OTP
    this.requestOtp();
  }

  requestOtp(): void {
    this.error = '';
    this.success = '';
    this.authService.requestOtp(this.email).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'OTP sent to your email';
          this.otpSent = true;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to request OTP. Please try again.';
      }
    });
  }

  resendOtp(): void {
    this.otpCode = '';
    this.requestOtp();
  }

  verifyOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.error = 'Please enter a valid 6-digit OTP';
      return;
    }

    this.verifying = true;
    this.error = '';

    this.authService.verifyOtp(this.email, this.otpCode).subscribe({
      next: (response) => {
        this.verifying = false;
        if (response.success) {
          const user = response.data;
          // Clear the temporary email storage
          localStorage.removeItem('loginEmail');
          
          // Load cart after successful login
          this.cartService.loadCartCount();

          this.success = 'OTP verified! Logging you in...';
          
          // Redirect based on role
          setTimeout(() => {
            if (user.role === 'vendor') {
              this.router.navigate(['/vendor/dashboard']);
            } else if (user.role === 'admin') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1500);
        }
      },
      error: (err) => {
        this.verifying = false;
        this.error = err.error?.message || 'Invalid OTP. Please try again.';
      }
    });
  }

  goBack(): void {
    localStorage.removeItem('loginEmail');
    this.router.navigate(['/login']);
  }
}
