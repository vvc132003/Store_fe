import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pages-register',
  templateUrl: './pages-register.component.html',
  styleUrls: ['./pages-register.component.scss']
})
export class PagesRegisterComponent implements OnInit, OnDestroy {

  user_register: any = {};
  constructor(private titleService: Title, private _user: UserService, private router: Router, private _notification: NotificationService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle("Đăng ký tài khoản");
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  confirmPassword = '';

  register() {
    if (this.user_register.password !== this.confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }
    this.subscription.add(
      this._user.postRegister(this.user_register).subscribe((data: any) => {
        this.router.navigate(['/dang-nhap']);
        this._notification.showSuccess('1004');
      })
    )

  }
}