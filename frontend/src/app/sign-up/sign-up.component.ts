import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

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
    return Array(new Date().getFullYear() - 1970 + 1).fill(1970).map((_, i) => 1970 + i);
  }

  signUpForm: FormGroup = this.formBuilder.group({
    username: ['', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]{8,100}$/)
    ]],
    password: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,100}$/)
    ]],
    password2: ['', [
      Validators.required,
      this.matchingPassword
    ]],
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    phone: ['', [
      Validators.pattern(/^\d{10}$/)
    ]],
    dob: this.formBuilder.group({
      day: ['', [
        Validators.required
      ]],
      month: ['', [
        Validators.required
      ]],
      year: ['', [
        Validators.required
      ]]
    }, { validators: this.dateValidator }),
    gender: ''
  });

  //getters for all form controls
  get username() { return this.signUpForm.get('username'); }
  get password() { return this.signUpForm.get('password'); }
  get password2() { return this.signUpForm.get('password2'); }
  get email() { return this.signUpForm.get('email'); }
  get phone() { return this.signUpForm.get('phone'); }
  get dob() { return this.signUpForm.get('dob'); }
  get day() { return this.signUpForm.get('dob.day'); }
  get month() { return this.signUpForm.get('dob.month'); }
  get year() { return this.signUpForm.get('dob.year'); }
  get gender() { return this.signUpForm.get('gender'); }


  matchingPassword(password2: AbstractControl): ValidationErrors | null {
    const password = password2.parent?.get("password");

    if (password2.value !== password?.value) {
      return { 'matchPassword': true };
    }
    return null;
  }

  dateValidator(group: AbstractControl): ValidationErrors | null {
    const day = +group.get("day")?.value;
    const month = +group.get("month")?.value;
    const year = +group.get("year")?.value;

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
  ) { }

  onSubmit() {
    this.signUpForm.markAllAsTouched();
    console.log(this.dob?.errors);
  }

}
