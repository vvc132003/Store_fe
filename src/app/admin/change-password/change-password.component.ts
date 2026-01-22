import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { NotificationService } from 'src/app/services/notification.service';
import { SettingsService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnDestroy, OnInit {
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  passwordRules = {
    minLength: false,
    symbol: false
  };
  passwordTouched = false;
  settings: any;
  securitySettings: any;
  pre: any = {};

  constructor(private _user: UserService, private auth: AuthService,private router: Router, private _setting: SettingsService, private _notfication: NotificationService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadSetting();
  }
  checkPassword() {
    const password = this.pre.new_password || '';

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

  loadSetting() {
    this.subscription.add(
      this._setting.getData().subscribe((res: any) => {
        this.settings = res;
        this.securitySettings = res?.data?.SecuritySettings;
      })
    );
  }

  changeP(): void {
    this.subscription.add(
      this._user.passwordreset(this.pre).subscribe((res: any) => {
        if (res != null && res.code) {
          this._notfication.showError(res.code);
          return;
        }
        this.auth.logout().subscribe(() => {
          this.router.navigate(['/dang-nhap']);
        });
        this._notfication.showSuccess("1033");
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
