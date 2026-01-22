import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/AuthService';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  @Output() languageChange = new EventEmitter<string>();
  @Input() settings: any;
  countnoti: number = 0;
  constructor(private elRef: ElementRef, private auth: AuthService, private _user: UserService, private cookieService: CookieService, private router: Router) { }

  selectedLanguage: string = 'vi';
  onLanguageChange(): void {
    this.languageChange.emit(this.selectedLanguage);
    localStorage.setItem('selectedLanguage', this.selectedLanguage);
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('selectedLanguage');
    this.selectedLanguage = savedLang || 'vi';
  }
  logo: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.settings)
    if (changes['settings'] && this.settings) {
      this.logo = this.settings?.data?.SiteSettings?.logo || "";
    }
  }

  onCountNotiChange(count: number) {
    this.countnoti = count;
  }



  showoNotification = false;
  showoNotificationt() {
    this.showoNotification = true;
  }
  closeNotification() {
    this.showoNotification = false;
  }
  isMenuOpen = false;

  toggleMenu(event: MouseEvent) {
    event.stopPropagation(); // ⛔ chặn bubble
    this.isMenuOpen = !this.isMenuOpen;
  }


  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  logoutByOtherLogin() {
    this._user.stopConnection();
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/dang-nhap']);
    });
  }

}
