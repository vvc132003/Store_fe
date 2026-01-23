import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { NotificationService } from 'src/app/services/notification.service';
import { SettingsService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  stars: { top: string; left: string; size: string; delay: string }[] = [];

  birdStyles: {
    top: string;
    duration: string;
    delay: string;
    scale: string;
  }[] = [];
  passwordRules = {
    minLength: false,
    symbol: false
  };
  passwordTouched = false;
  settings: any;
  securitySettings: any;
  pre: any = {};
  showNewPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  constructor(private titleService: Title, private auth: AuthService,
    private _user: UserService, private _setting: SettingsService, private router: Router, private route: ActivatedRoute, private _notification: NotificationService) { }
  private subscription = new Subscription();
  ngOnInit(): void {
    this.titleService.setTitle("Đăng nhập");
    this.generateBirds();
    this.generateStars();
    this.loadSetting();
  }
  loadSetting() {
    this.subscription.add(
      this._setting.getData().subscribe((res: any) => {
        this.settings = res;
        this.securitySettings = res?.data?.SecuritySettings;
      })
    );
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

  submitResetPassword() {
    if (this.pre.new_password !== this.pre.confirm_password) {
      this._notification.showError("1032");
      return;
    }
    this.isSubmitting = true;
    this.subscription.add(
      this._user.resetPassword(this.pre).subscribe((res: any) => {
        if (res != null && res.code) {
          this._notification.showError(res.code);
          this.isSubmitting = false;
          return;
        }
        this.router.navigate(['/dang-nhap']);
        this._notification.showSuccess("1033");
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}