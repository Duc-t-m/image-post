import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/model/user.type';
import { SecurityService } from 'src/service/security.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required,
      // Validators.pattern(/^[a-zA-Z0-9]{8,100}$/)
    ]],
    password: ['', [Validators.required,
      // Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,100}$/)
    ]]
  });

  constructor(
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  onSubmit() {
    this.securityService.login(this.loginForm.value as UserDTO)
      .subscribe(
        token => {
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
        }
      );
  }
}
