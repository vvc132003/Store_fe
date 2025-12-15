import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  constructor(private titleService: Title, private _user: UserService, private router: Router, private _notification: NotificationService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle("Đăng nhập");
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  login() {
    this.subscription.add(
      this._user.postLogin(this.user_login).subscribe((data: any) => {
        this.router.navigate(['/']);
        this._notification.showSuccess('1005');
      })
    )

  }
}
