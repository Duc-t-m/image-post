import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {catchError, filter, of, startWith, Subject, switchMap, take, tap} from 'rxjs';
import {SignUpDTO} from 'src/model/user.type';
import {SecurityService} from 'src/service/security.service';
import {dateValidator, existControlValidator, matchingPasswordValidator} from 'src/validators/sign-up.validator';

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
      username: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]{8,100}$/)
        ],
        existControlValidator(this.securityService, "username")
      ],
      password: this.formBuilder.group(
        {
          pass: ['', [
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,100}$/)
          ]],
          cfpass: ['', [
            Validators.required
          ]]
        },
        {validators: matchingPasswordValidator('pass', 'cfpass')}
      ),
      email: ['',
        [
          Validators.required,
          Validators.email,
        ],
        existControlValidator(this.securityService, "email")
      ],
      phone: ['',
        [
          Validators.pattern(/^\d{10}$/),
        ],
        existControlValidator(this.securityService, "phone")
      ],
      dob: this.formBuilder.group(
        {
          day: '',
          month: '',
          year: '',
        },
        {validators: dateValidator('day', 'month', 'year')}),
      gender: ''
    }
  );

  //getters for all form controls
  get username() {
    return this.signUpForm.get('username') as AbstractControl;
  }

  get password() {
    return this.signUpForm.get('password') as AbstractControl;
  }

  get pass() {
    return this.signUpForm.get('password.pass') as AbstractControl;
  }

  get cfpass() {
    return this.signUpForm.get('password.cfpass') as AbstractControl;
  }

  get email() {
    return this.signUpForm.get('email') as AbstractControl;
  }

  get phone() {
    return this.signUpForm.get('phone') as AbstractControl;
  }

  get dob() {
    return this.signUpForm.get('dob') as AbstractControl;
  }

  get day() {
    return this.signUpForm.get('dob.day') as AbstractControl;
  }

  get month() {
    return this.signUpForm.get('dob.month') as AbstractControl;
  }

  get year() {
    return this.signUpForm.get('dob.year') as AbstractControl;
  }

  get gender() {
    return this.signUpForm.get('gender') as AbstractControl;
  }

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }


  formSubmit$ = new Subject<void>();

  ngOnInit() {
    this.formSubmit$
      .pipe(
        tap(() => this.signUpForm.markAllAsTouched()),
        switchMap(() =>
          this.signUpForm.statusChanges.pipe(
            startWith(this.signUpForm.status),
            filter(status => status != 'PENDING'),
            take(1)
          )
        ),
        filter(status => status == 'VALID'),
        tap(() => this.submitForm())
      )
      .subscribe();
  }

  submitForm() {
    let birthDate: Date | null = new Date(this.year.value, this.month.value - 1, this.day.value);
    if (this.year.value.length == 0)
      birthDate = null;
    let phoneNumber = this.phone.value;
    if (phoneNumber.length == 0)
      phoneNumber = null;

    this.securityService.signUp(
      {
        username: this.username.value,
        password: this.pass.value,
        email: this.email.value,
        phone: phoneNumber,
        dob: birthDate,
        gender: this.gender.value
      } as SignUpDTO)
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
