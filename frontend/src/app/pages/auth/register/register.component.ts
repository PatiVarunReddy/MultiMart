import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="container" style="max-width: 500px; margin-top: 3rem;">
      <div class="card">
        <h2>Register</h2>
        
        <div *ngIf="error" class="alert alert-error">{{error}}</div>
        <div *ngIf="success" class="alert alert-success">{{success}}</div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Name</label>
            <input type="text" formControlName="name" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Phone</label>
            <input type="text" formControlName="phone" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Register as</label>
            <select formControlName="role" class="form-control">
              <option value="customer">Customer</option>
              <option value="vendor">Vendor/Seller</option>
            </select>
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="registerForm.invalid || loading">
            {{loading ? 'Registering...' : 'Register'}}
          </button>
        </form>
        
        <p style="margin-top: 1rem;">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      role: ['customer', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = 'Registration successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
