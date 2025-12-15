import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.scss']
})
export class PagesLoginComponent implements OnInit, OnDestroy {

  user_login: any = {};
  constructor(private titleService: Title, private cookieService: CookieService,
    private _user: UserService, private router: Router, private _notification: NotificationService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle("Đăng nhập");
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private parseJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  login() {
    this.subscription.add(
      this._user.postLogin(this.user_login).subscribe((data: any) => {
        // this.cookieService.set('access_token', data.accessToken, {
        //   path: '/',
        //   secure: false,
        //   sameSite: 'Strict',
        //   // sameSite: 'None', // chỉ mở ra khi chạy https
        //   expires: 0.0104167
        // });
        this._user.setToken(data.accessToken);
        const payload = this.parseJwt(data.accessToken);
        const role = payload.role;

        if (role === 'admin') {
          this.router.navigate(['/admin/revenue/1000']);
        } else {
          this.router.navigate(['/']);
        }
        this._notification.showSuccess('1005');
      })
    )

  }
}
