import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy, OnChanges {

  constructor(private datePipe: DatePipe, private auth: AuthService, private sanitizer: DomSanitizer, private cookieService: CookieService, private _user: UserService, private elRef: ElementRef, private router: Router) { }
  private subscription = new Subscription();
  @Input() balance: number = 0;
  @Input() category_list: any[] = [];
  @Output() userLoaded = new EventEmitter<any>();
  @Input() settings: any;

  user: any = null;
  showSearchMobile = false;
  showoNotification = false;


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
    // const token = this.cookieService.get('access_token');
    // if (token) {
    //   const payload = this.parseJwt(token);
    //   if (payload) {
    //     // this.user = payload.unique_name || payload.name || payload.sub || null;
    //     this.loadUserbyId(payload);
    //   }
    // }
    this.auth.session().subscribe(isAuth => {
      if (!isAuth) {
        return;
      }
      this.auth.me().subscribe(user => {
        this.loadUserbyId();
      });
    });


  }

  logo: string = "";
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.settings)
    if (changes['settings'] && this.settings) {
      this.logo = this.settings?.data?.SiteSettings?.logo || "";
    }
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  getFormattedTime(dateStr: string | Date): string | null {
    const date = new Date(dateStr);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return null;
    }
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (diffMinutes < 1) {
      return 'Vừa xong';
    } else if (diffMinutes < 60 && isToday) {
      return `${diffMinutes} phút trước`;
    } else if (isToday) {
      return this.datePipe.transform(date, 'HH:mm') ?? 'ngày';
    } else if (isYesterday) {
      return `Hôm qua ${this.datePipe.transform(date, 'HH:mm') ?? ''}`;
    } else if (date.getFullYear() === now.getFullYear()) {
      return this.datePipe.transform(date, 'dd/MM HH:mm') ?? '';
    } else {
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') ?? '';
    }
  }



  sanitizeMessage(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }


  //#region  event
  currentNotification: any = null;

  onNotification(notification: any) {
    this.currentNotification = notification;
  }



  countnoti: number = 0;


  onCountNotiChange(count: number) {
    this.countnoti = count;
    this.closeNotification();
  }

  logout() {
    this._user.stopConnection();
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/dang-nhap']);
    });
  }

  toggleMobileSearch() {
    this.showSearchMobile = !this.showSearchMobile;
  }

  showMenuOpenMobile = false;

  toggleMobileMenu() {
    this.showMenuOpenMobile = !this.showMenuOpenMobile;
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

  showoNotificationt() {
    this.showoNotification = true;
  }
  closeNotification() {
    this.showoNotification = false;
  }

  loadUserbyId() {
    this.subscription.add(
      this._user.getUserById().subscribe({
        next: (data: any) => {
          this.user = data;
          this.userLoaded.emit(data);
        },
        error: (err) => {
          if (err.status === 401) {
            this.user = null;
            this.userLoaded.emit(null);
          }
        }
      })
    );
  }


}
