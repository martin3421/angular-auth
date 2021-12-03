import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form = {
    email: null,
    password: null,
  };
  errorMessage: string;

  @ViewChild('loginForm', { static: false }) loginForm: NgForm;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.form).subscribe(
        () => {
          this.router.navigateByUrl('/');
        },
        (err) => {
          this.errorMessage = err && err.error;
        }
      );
    } else {
      this.errorMessage = 'Please enter valid data';
    }
  }

  resetError(): void {
    this.errorMessage = null;
  }
}
