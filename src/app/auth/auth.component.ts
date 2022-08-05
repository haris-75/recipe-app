import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponse } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  isLoginMode: boolean = false;
  loaderFlag: boolean = false;
  error: string = '';

  switchLoginMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  submitForm(form: NgForm) {
    this.loaderFlag = true;
    let email = form.value.email;
    let password = form.value.password;
    if (!email || !password) {
      this.loaderFlag = false;
      this.error = 'Invalid email or password';
      return;
    }
    let authRes: Observable<AuthResponse>;
    if (this.isLoginMode) {
      authRes = this.authService.login(email, password);
    } else {
      authRes = this.authService.signup(email, password);
    }
    authRes.subscribe(
      (response) => {
        console.log(response);
        this.loaderFlag = false;
        this.router.navigate(['/recipes']);
      },
      (errorResponse) => {
        this.error = errorResponse;
        this.loaderFlag = false;
      }
    );
    form.reset();
  }
}
