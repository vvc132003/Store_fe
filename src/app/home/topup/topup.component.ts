import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.scss']
})
export class TopupComponent implements OnInit {
  activeTab = 1;
  code: string = "";
  @Output() closed = new EventEmitter<void>();
  constructor(private cookieService: CookieService, private titleService: Title) { }
  // private parseJwt(token: string): any {
  //   const payload = token.split('.')[1];
  //   const decoded = atob(payload);
  //   const utf8 = decodeURIComponent(
  //     decoded
  //       .split('')
  //       .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //       .join('')
  //   );
  //   return JSON.parse(utf8);
  // }
  ngOnInit(): void {
    const token = this.cookieService.get('access_token');
    // const payload = this.parseJwt(token);
    // this.code = payload.code;
    this.titleService.setTitle("Nạp tiền");
  }
  close() {
    this.closed.emit();
  }

  currentUser: any = {};

  onUserLoaded(user: any) {
    this.currentUser = user;
  }
  settingP: any = {};
  previewImg_bankQR: string | null = null;
  previewImg_momoQR: string | null = null;

  paymentSettings(setting: any) {
    this.settingP = setting || {};
    this.settingP.bank = this.settingP.bank || {};
  }
}
