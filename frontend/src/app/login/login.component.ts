import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, throwError } from 'rxjs';
import { UserLoginDTO } from 'src/model/user.type';
import { SecurityService } from 'src/service/security.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: ['',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{8,100}$/)
      ]
    ],
    password: ['',
      [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,100}$/)
      ]
    ]
  });
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid)
      return;
    this.securityService.login(this.loginForm.value as UserLoginDTO)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.toastr.error(err.error, "Error");
          return of(null);
        })
      )
      .subscribe(
        token => {
          if (token) {
            this.securityService.authenticationSuccess(token);
            this.router.navigate(['/home']);
          }
        }
      );
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
