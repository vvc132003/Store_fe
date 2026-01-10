import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { forkJoin, tap } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { SettingsService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnDestroy, OnChanges, OnInit {


  setting: any = {
    SiteSettings: { siteName: '', logo: '', maintenanceMode: false, defaultLanguage: 'vi', defaultUserAvatar: '' },
    PaymentSettings: { gateways: [], currency: 'VND', commission: 10, enableTestMode: false },
    EmailSettings: { smtpHost: '', smtpPort: 587, username: '', password: '', enableSSL: false },
    ThemeSettings: { theme: 'dark', primaryColor: '#FF5733', secondaryColor: '#333333' },
    SEOSettings: { metaTitle: '', metaDescription: '', metaKeywords: '' },
    SecuritySettings: { enable2FA: false, passwordMinLength: 8, requireSymbols: false },
    NotificationSettings: { emailNotifications: false, pushNotifications: false, lowBalanceThreshold: 10000 }
  };

  constructor(private titleService: Title, private _setting: SettingsService, private _notification: NotificationService) { }


  ngOnInit(): void {
    this.titleService.setTitle('Cài đặt');
  }

  ngOnDestroy(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  save(): void {
    if (!this.key) {
      this.saveSettings();
    } else {
      this.updateSettings();
    }
  }

  saveSettings(): void {
    if (!this.selectedFile_img_logo || !this.selectedFile_img_avatar) {
      this._notification.showError("1022");
      return;
    }

    const payload = {
      Key: 'GeneralSettings',
      Data: this.setting,
      IsPublic: true
    };

    this._setting.uploadLogo(this.selectedFile_img_logo, this.selectedFile_img_avatar).subscribe((res: any) => {
      payload.Data.SiteSettings.logo = res.logoUrl;
      this._setting.postData(payload).subscribe(() => {
        // console.log("thành công");
        this._notification.showSuccess("1020");
      })
    })
  }

  // private stripDomain(url: string | null): string {
  //   if (!url) return '';
  //   return url.replace(/^https?:\/\/[^\/]+/, '');
  // }

  updateSettings(): void {
    const payload = {
      Id: this.key,
      Key: 'GeneralSettings',
      Data: this.setting,
      IsPublic: true
    };

    const uploadObservables = [];

    if (this.selectedFile_img_logo || this.selectedFile_img_avatar) {
      uploadObservables.push(
        this._setting.uploadLogo(this.selectedFile_img_logo, this.selectedFile_img_avatar)
          .pipe(tap((res: any) => {
            if (res.logoUrl && res.logoUrl.trim() !== '') {
              this.setting.SiteSettings.logo = res.logoUrl;
            } else {
              delete this.setting.SiteSettings.logo;
            }

            if (res.avatarUrl && res.avatarUrl.trim() !== '') {
              this.setting.SiteSettings.defaultUserAvatar = res.avatarUrl;
            } else {
              delete this.setting.SiteSettings.defaultUserAvatar;
            }
          }))
      );
    }

    if (uploadObservables.length > 0) {
      forkJoin(uploadObservables).subscribe({
        next: () => this._updateData(payload),
        error: () => this._notification.showError("Error uploading images")
      });
    } else {
      delete this.setting.SiteSettings.logo;
      delete this.setting.SiteSettings.defaultUserAvatar;
      this._updateData(payload);
      
    }
  }

  private _updateData(payload: any) {
    // console.log(payload);
    this._setting.updateData(payload.Key, payload).subscribe({
      next: () => this._notification.showSuccess("1021"),
      error: () => this._notification.showError("Error updating settings")
    });
  }




  // Hàm định dạng số thành VND
  formatVND(value: number | null): string {
    if (!value) return '';
    return value.toLocaleString('vi-VN') + ' ₫';
  }

  // Xử lý input
  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // Loại bỏ ký tự không phải số
    const numericValue = input.value.replace(/[^0-9]/g, '');

    // Cập nhật project.price (số nguyên)
    this.setting.NotificationSettings.lowBalanceThreshold = numericValue ? parseInt(numericValue, 10) : 0;

    // Hiển thị lại định dạng VND
    input.value = this.formatVND(this.setting.NotificationSettings.lowBalanceThreshold);
  }

  selectedFile_img_avatar?: File;
  previewImg_avatar: string | null = null;
  onFileSelected_img_avatar(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      this._notification.showError('Chỉ cho phép ảnh PNG (nền trong suốt)');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFile_img_avatar = file;
      this.previewImg_avatar = reader.result as string;
    };

    reader.readAsDataURL(file);
  }


  selectedFile_img_logo?: File;
  previewImg_logo: string | null = null;

  onFileSelected_img_logo(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      this._notification.showError('Chỉ cho phép ảnh PNG (nền trong suốt)');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this._notification.showError('Dung lượng ảnh tối đa 2MB');
      event.target.value = '';
      return;
    }

    this.setting.SiteSettings.logo = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFile_img_logo = file;
      this.previewImg_logo = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  key: string = "";
  receiveData(event: any) {
    this.setting = event.data;
    this.key = event.id;
    // console.log(event);
    this.previewImg_logo = this.setting.SiteSettings.logo;
    this.previewImg_avatar = this.setting.SiteSettings.defaultUserAvatar;

    // console.log(event)
  }

}
