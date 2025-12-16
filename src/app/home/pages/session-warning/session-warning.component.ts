import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-warning',
  templateUrl: './session-warning.component.html',
  styleUrls: ['./session-warning.component.scss']
})
export class SessionWarningComponent {

  constructor(private router: Router) {}

  reLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    // clear token / session
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
