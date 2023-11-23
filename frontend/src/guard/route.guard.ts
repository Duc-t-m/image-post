import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ToastrService} from 'ngx-toastr';

export const authenticated: CanActivateFn = (route, state) => {
  const jwtHelper = inject(JwtHelperService);
  const toastr = inject(ToastrService);
  let token = jwtHelper.tokenGetter();
  if (!token) {
    toastr.warning("You must login to access this page", "Warning");
    return false;
  }
  if (jwtHelper.isTokenExpired(token.toString())) {
    toastr.warning("Your session has expired", "Warning");
    return false;
  }
  return true;
};


