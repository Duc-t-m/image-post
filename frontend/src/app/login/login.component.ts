import {HttpErrorResponse} from '@angular/common/http';
import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {catchError, of} from 'rxjs';
import {LoginDTO} from 'src/model/user.type';
import {SecurityService} from 'src/service/security.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  authorizeEndpoint = "http://localhost:8080/oauth2/authorize";
  redirectUri = "http://localhost:4200/oauth2/redirect";
  google = this.authorizeEndpoint + "/google?redirect_uri=" + this.redirectUri;
  github = this.authorizeEndpoint + "/github?redirect_uri=" + this.redirectUri;
  facebook = this.authorizeEndpoint + "/facebook?redirect_uri=" + this.redirectUri;

  loginForm = this.formBuilder.group({
    username: ['',
      [
        Validators.required
      ]
    ],
    password: ['',
      [
        Validators.required
      ]
    ]
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid)
      return;
    this.securityService.login(this.loginForm.value as LoginDTO)
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
