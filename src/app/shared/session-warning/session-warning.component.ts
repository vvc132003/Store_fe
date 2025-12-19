import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-warning',
  templateUrl: './session-warning.component.html',
  styleUrls: ['./session-warning.component.scss']
})
export class SessionWarningComponent {

  @Input() text: string = "Tài khoản của bạn đang đăng nhập ở nơi khác";
  @Input() buttons: string = "Đăng xuất";
  @Input() event: string = "login";
  @Input() showWarning: boolean = false;
  constructor(private router: Router) { }

  reLogin() {
    this.showWarning = false;
    this.router.navigate(['/dang-nhap']);
  }

  button(event: string) {
    if (event == "login") {
      localStorage.clear();
      this.showWarning = false;
      this.router.navigate(['/dang-nhap']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
