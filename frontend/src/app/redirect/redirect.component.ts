import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/service/security.service';

@Component({
  selector: 'redirect',
  templateUrl: './redirect.component.html'
})
export class RedirectComponent {
  constructor(
    private router: Router,
    private securityService: SecurityService
  ) { }  

  ngOnInit() {
    let token = this.router.url.substring(this.router.url.indexOf('=') + 1);
    if(token && token.length!=0) {
      this.securityService.authenticationSuccess(token);
      this.router.navigate(['/home']);
      return;
    }
    this.router.navigate(['/login']);
  }
}
