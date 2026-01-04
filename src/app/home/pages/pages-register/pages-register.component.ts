import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { SettingsService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pages-register',
  templateUrl: './pages-register.component.html',
  styleUrls: ['./pages-register.component.scss']
})
export class PagesRegisterComponent implements OnInit, OnDestroy {

  user_register: any = {};
  constructor(private titleService: Title,
    private _user: UserService,
    private router: Router,
    private _notification: NotificationService,
    private _setting: SettingsService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle("Đăng ký tài khoản");
    this.loadSetting();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  settings: any;
  securitySettings: any;


  loadSetting() {
    this.subscription.add(
      this._setting.getData().subscribe((res: any) => {
        this.settings = res;
        this.securitySettings = res?.data?.SecuritySettings;
      })
    );
  }



  passwordRules = {
    minLength: false,
    symbol: false
  };
  passwordTouched = false;


  checkPassword() {
    const password = this.user_register.password || '';

    if (password.length === 0) {
      this.passwordTouched = false;

      this.passwordRules = {
        minLength: false,
        symbol: false
      };
      return;
    }

    this.passwordTouched = true;

    this.securitySettings = this.settings?.data?.SecuritySettings;
    if (!this.securitySettings) return;

    this.passwordRules.minLength =
      password.length >= this.securitySettings.passwordMinLength;

    if (this.securitySettings.requireSymbols) {
      const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
      this.passwordRules.symbol = symbolRegex.test(password);
    } else {
      this.passwordRules.symbol = true;
    }
  }

  showPassword = false;
  showConfirmPassword = false;





  confirmPassword = '';

  register() {

    this.checkPassword();

    if (!this.passwordRules.minLength || !this.passwordRules.symbol) {
      this._notification.showError("1023");
      return;
    }

    if (this.user_register.password !== this.confirmPassword) {
      this._notification.showError("1024");
      return;
    }
    // console.log(this.user_register);
    this.subscription.add(
      this._user.postRegister(this.user_register).subscribe((data: any) => {
        this.router.navigate(['/dang-nhap']);
        this._notification.showSuccess('1004');
      })
    )

  }
}