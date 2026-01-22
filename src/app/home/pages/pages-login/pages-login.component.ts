import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.scss']
})
export class PagesLoginComponent implements OnInit, OnDestroy {
  stars: { top: string; left: string; size: string; delay: string }[] = [];

  birdStyles: {
    top: string;
    duration: string;
    delay: string;
    scale: string;
  }[] = [];
  showPassword = false;
  showConfirmPassword = false;

  user_login: any = {};
  showSessionWarning: boolean = false;
  constructor(private titleService: Title, private cookieService: CookieService, private auth: AuthService,
    private _user: UserService, private router: Router, private route: ActivatedRoute, private _notification: NotificationService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle("Đăng nhập");
    this.showWarning = false;

    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.showWarning = true;

        // 🔥 xoá param sau khi đọc
        setTimeout(() => {
          this.router.navigate([], {
            queryParams: {},
            replaceUrl: true
          });
        });
      }
    });
    this.generateBirds();
    this.generateStars();
  }

  generateStars() {
    const numStars = 100;
    this.stars = [];

    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        top: `${Math.random() * 100 + 15}vh`,
        left: `${Math.random() * 100}vw`,
        size: `${Math.random() * 2 + 1}px`,  // ngôi sao nhỏ 1-3px
        delay: `${Math.random() * 5}s`
      });
    }
  }

  generateBirds() {
    const numBirds = 10; // số chim
    this.birdStyles = [];

    for (let i = 0; i < numBirds; i++) {
      this.birdStyles.push({
        top: `${Math.random() * 60 + 10}vh`,        // bay từ trên xuống giữa
        duration: `${20 + Math.random() * 20}s`,    // bay chậm
        delay: `${Math.random() * 10}s`,
        scale: `scale(${0.3 + Math.random() * 0.4})`
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // this._user.stopConnection1();
  }
  // private parseJwt(token: string): any {
  //   const payload = token.split('.')[1];
  //   const decoded = atob(payload);
  //   return JSON.parse(decoded);
  // }

  login() {
    if (!this.user_login.email) {
      this._notification.showWarning("1019");
      return;
    }

    this.subscription.add(
      this._user.postLogin(this.user_login).subscribe({
        next: () => {

          // 🔥 HỎI BACKEND: tôi là ai?
          this.auth.me().subscribe(user => {
            if (user.role === 'admin') {
              this.router.navigate(['/mbcode/admin/revenue/1000']);
            } else {
              const lastRoute = localStorage.getItem('last_route');

              if (lastRoute) {
                this.router.navigateByUrl(lastRoute);
              }

            }

            this._user.startConnection(user.id).subscribe();

            this._user.listenForceLogout(() => {
              this.logoutByOtherLogin();
            });
            this._notification.showSuccess('1005');
          });

        },
        error: () => {
          this._notification.showError("Login failed");
        }
      })
    );
  }
  logoutByOtherLogin() {

    this._user.stopConnection();

    this.auth.logout().subscribe(() => {
      this.router.navigate(['/dang-nhap'], {
        queryParams: { sessionExpired: true }
      });
    });
  }

  showWarning: boolean = false;

}
