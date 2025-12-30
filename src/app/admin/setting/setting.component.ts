import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {


  setting: any = {
    SiteSettings: { siteName: '', logo: '', maintenanceMode: true, defaultLanguage: 'vi' },
    PaymentSettings: { gateways: [], currency: 'VND', commission: 10, enableTestMode: true },
    EmailSettings: { smtpHost: '', smtpPort: 587, username: '', password: '', enableSSL: true },
    ThemeSettings: { theme: 'dark', primaryColor: '#FF5733', secondaryColor: '#333333' },
    SEOSettings: { metaTitle: '', metaDescription: '', metaKeywords: '' },
    SecuritySettings: { enable2FA: true, passwordMinLength: 8, requireSymbols: true },
    NotificationSettings: { emailNotifications: true, pushNotifications: true, lowBalanceThreshold: 10000 }
  };

  constructor(private _setting: SettingsService) { }

  saveSettings(): void {
    if (!this.selectedFile_img) {
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
        console.log("thành công");
      })
    })
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


}
