import { Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { SettingsService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnDestroy, OnChanges {


  setting: any = {
    SiteSettings: { siteName: '', logo: '', maintenanceMode: false, defaultLanguage: 'vi' },
    PaymentSettings: { gateways: [], currency: 'VND', commission: 10, enableTestMode: false },
    EmailSettings: { smtpHost: '', smtpPort: 587, username: '', password: '', enableSSL: false },
    ThemeSettings: { theme: 'dark', primaryColor: '#FF5733', secondaryColor: '#333333' },
    SEOSettings: { metaTitle: '', metaDescription: '', metaKeywords: '' },
    SecuritySettings: { enable2FA: false, passwordMinLength: 8, requireSymbols: false },
    NotificationSettings: { emailNotifications: false, pushNotifications: false, lowBalanceThreshold: 10000 }
  };

  constructor(private _setting: SettingsService, private _notification: NotificationService) { }
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
    if (!this.selectedFile_img) {
      this._notification.showError("1022");
      return;
    }

    const payload = {
      Key: 'GeneralSettings',
      Data: this.setting,
      IsPublic: true
    };

    this._setting.uploadLogo(this.selectedFile_img, this.setting.SiteSettings.logo).subscribe((res: any) => {
      payload.Data.SiteSettings.logo = res.thumbnailUrl;
      this._setting.postData(payload).subscribe(() => {
        // console.log("thành công");
        this._notification.showSuccess("1020");
      })
    })
  }

  updateSettings(): void {
    const payload = {
      Id: this.key,
      Key: 'GeneralSettings',
      Data: this.setting,
      IsPublic: true
    };
    if (this.previewImg) {
      this.setting.SiteSettings.logo = '';
    }
    this._setting.updateData(payload.Key, payload).subscribe(() => {
      this._notification.showSuccess("1021");

    })
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

  selectedFile_img: File | null = null;
  previewImg: string | null = null;
  onFileSelected_img(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.setting.SiteSettings.logo = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile_img = file;
        // console.log(this.selectedFile_img);
        this.previewImg = reader.result as string; // <-- gán trực tiếp
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
    }
  }
  key: string = "";
  receiveData(event: any) {
    this.setting = event.data;
    this.key = event.id;
    // console.log(event);
    this.previewImg = this.setting.SiteSettings.logo;
    // console.log(event)
  }

}
