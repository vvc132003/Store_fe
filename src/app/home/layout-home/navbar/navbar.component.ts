import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy, OnChanges {

  constructor(private cookieService: CookieService, private _user: UserService, private elRef: ElementRef, private router: Router) { }
  private subscription = new Subscription();

  @Input() balance: number = 0;
  @Input() category_list: any[] = [];
  @Output() userLoaded = new EventEmitter<any>();
  @Input() settings: any;

  user: any = null;
  showSearchMobile = false;
  showoNotification = false;


  private parseJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const utf8 = decodeURIComponent(
      decoded
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(utf8);
  }

  ngOnInit(): void {
    const token = this.cookieService.get('access_token');
    if (token) {
      const payload = this.parseJwt(token);
      if (payload) {
        // this.user = payload.unique_name || payload.name || payload.sub || null;
        this.loadUserbyId(payload);
      }
    }
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


  //#region  event

  countnoti: number = 0;


  onCountNotiChange(count: number) {
    this.countnoti = count;
    this.closeNotification();
  }

  logout() {
    this.cookieService.delete('access_token', '/');
    this.user = null;
    this.router.navigate(['/dang-nhap']);
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

  loadUserbyId(payload: any) {
    this.subscription.add(
      this._user.getUserById(payload?.nameid).subscribe((data: any) => {
        this.user = data;
        this.userLoaded.emit(data);
        // console.log(this.user);
      })
    )
  }

}
