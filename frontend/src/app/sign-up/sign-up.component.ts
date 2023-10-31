import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { UserSignUpDTO } from 'src/model/user.type';
import { SecurityService } from 'src/service/security.service';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent {
  get days() {
    return Array(31).fill(0).map((_, i) => i + 1);
  }

  get months() {
    return [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ];
  }

  get years() {
    let currentYear = new Date().getFullYear();
    return Array(currentYear - 1970 + 1).fill(0).map((_, i) => currentYear - i);
  }

  signUpForm: FormGroup = this.formBuilder.group(
    {
      username: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{8,100}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,100}$/)
      ]],
      password2: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.pattern(/^\d{10}$/)
      ]],
      dob: this.formBuilder.group({
        day: '',
        month: '',
        year: '',
      }, { validators: this.dateValidator }),
      gender: ''
    },
    {
      validators: this.matchingPassword('password', 'password2')
    }
  );

  //getters for all form controls
  get username() { return this.signUpForm.get('username') as AbstractControl; }
  get password() { return this.signUpForm.get('password') as AbstractControl; }
  get password2() { return this.signUpForm.get('password2') as AbstractControl; }
  get email() { return this.signUpForm.get('email') as AbstractControl; }
  get phone() { return this.signUpForm.get('phone') as AbstractControl; }
  get dob() { return this.signUpForm.get('dob') as AbstractControl; }
  get day() { return this.signUpForm.get('dob.day') as AbstractControl; }
  get month() { return this.signUpForm.get('dob.month') as AbstractControl; }
  get year() { return this.signUpForm.get('dob.year') as AbstractControl; }
  get gender() { return this.signUpForm.get('gender') as AbstractControl; }

  matchingPassword(passwordControlName: string, password2ControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const { value: password } = formGroup.get(passwordControlName) as AbstractControl;
      const { value: password2 } = formGroup.get(password2ControlName) as AbstractControl;
      if (password2 != password)
        return { 'passwordsNotMatch': true };
      return null;
    }
  }
  dateValidator(dob: AbstractControl): ValidationErrors | null {
    let day = +dob.get("day")?.value;
    let month = +dob.get("month")?.value;
    let year = +dob.get("year")?.value;
    //check if day, month, year all equal to 0 or all not equal to 0
    if (!((day == 0 && month == 0 && year == 0) || (day != 0 && month != 0 && year != 0))) {
      return { 'date': true };
    }

    const month30 = [4, 6, 9, 11];

    if (month30.includes(month) && day > 30) {
      return { 'date': true };
    }

    if (month == 2 && day > 29) {
      return { 'date': true };
    }

    if (month == 2 && day == 29 &&
      (year % 4 != 0 || (year % 100 == 0 && year % 400 != 0))) {
      return { 'date': true };
    }
    return null;
  }

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  onSubmit() {
    this.signUpForm.markAllAsTouched();
    if (!this.signUpForm.valid)
      return;

    let birthDate: Date | null = new Date(this.year.value, this.month.value - 1, this.day.value);
    if (this.year.value.length == 0)
      birthDate = null;
    let phoneNumber = this.phone.value;
    if (phoneNumber.length == 0)
      phoneNumber = null;

    this.securityService.signUp(
      {
        username: this.username.value,
        password: this.password.value,
        email: this.email.value,
        phone: phoneNumber,
        dob: birthDate,
        gender: this.gender.value
      } as UserSignUpDTO)
      .pipe(
        catchError(err => {
          this.toastr.error(err.error, 'Sign up failed');
          return of(null);
        })
      )
      .subscribe(token => {
        if (token) {
          this.securityService.authenticationSuccess(token);
          this.toastr.success('Sign up successfully', 'Welcome');
          this.router.navigate(['/home']);
        }
      });
  }

}
