import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/service/security.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private securityService: SecurityService
  ) { }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  get showLogout() {
    return this.securityService.isAuthenticated();
  }
}
