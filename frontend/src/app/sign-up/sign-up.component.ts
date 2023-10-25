import { Component } from '@angular/core';

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

}
