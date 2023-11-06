import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/service/security.service';

@Component({
  selector: 'pending',
  templateUrl: './pending.component.html'
})
export class PendingComponent {
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.securityService.isAuthenticated())
      this.router.navigate(['/home']);
    else
      this.router.navigate(['/login']);
  }

}
