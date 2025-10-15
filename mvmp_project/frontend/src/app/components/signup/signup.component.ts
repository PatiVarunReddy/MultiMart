import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.auth.signup(this.signupForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Signup successful. Redirecting to login...';
          setTimeout(()=> this.router.navigate(['/login']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.msg || 'Signup failed';
        }
      });
    }
  }
}
