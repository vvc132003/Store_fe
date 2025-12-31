import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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

  showPassword = false;
  showConfirmPassword = false;

  user_login: any = {};
  showSessionWarning: boolean = false;
  constructor(private titleService: Title, private cookieService: CookieService,
    private _user: UserService, private router: Router, private route: ActivatedRoute, private _notification: NotificationService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle("Đăng nhập");
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired']) {
        this.showWarning = true;
      }
    });
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
    if (!this.user_login.email) {
      this._notification.showWarning("1019");
      return;
    }
    this.subscription.add(
      this._user.postLogin(this.user_login).subscribe((data: any) => {
        if (!data.accessToken) {
          this._notification.showError(data.code);
          return;
        }
        this._user.setToken(data.accessToken);
        const payload = this.parseJwt(data.accessToken);
        const role = payload.role;
        if (role === 'admin') {
          this.router.navigate(['/mbcode/admin/revenue/1000']);
        } else {
          this.router.navigate(['/']);
        }
        this.loadSoket(payload);
        this._notification.showSuccess('1005');
      })
    )

  }
  showWarning: boolean = false;

  loadSoket(data: any) {
    this._user.removeToken().subscribe(() => {
      this.cookieService.delete('access_token', "/");
      this.router.navigate(['/dang-nhap'], { queryParams: { sessionExpired: true } });
    });
    this.subscription.add(
      this._user.startConnection1(data.nameid).subscribe((data: any) => {
      })
    )
  }

}
