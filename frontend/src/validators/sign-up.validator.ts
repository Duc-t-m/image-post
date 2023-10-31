import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, map, of, switchMap, timer } from "rxjs";
import { SecurityService } from "src/service/security.service";

export function matchingPasswordValidator(
    passwordControlName: string,
    password2ControlName: string
): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const { value: password } = formGroup.get(passwordControlName) as AbstractControl;
        const { value: password2 } = formGroup.get(password2ControlName) as AbstractControl;
        if (password2 != password)
            return { 'passwordsNotMatch': true };
        return null;
    }
}

export function dateValidator(
    dayControlName: string,
    monthControlName: string,
    yearControlName: string
): ValidatorFn {
    return (dob: AbstractControl): ValidationErrors | null => {
        let day = +dob.get(dayControlName)?.value;
        let month = +dob.get(monthControlName)?.value;
        let year = +dob.get(yearControlName)?.value;

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
}

export function existControlValidator(
    securityService: SecurityService,
    controlName: string
): ValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value)
            return of(null);
        return timer(500).pipe(
            switchMap(() => securityService.checkFieldExists(controlName, control.value)
                .pipe(map(exist => exist ? { [controlName + "Exists"]: true } : null))
            )
        );
    }
}