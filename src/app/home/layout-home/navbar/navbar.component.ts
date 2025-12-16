import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private cookieService: CookieService, private elRef: ElementRef, private router: Router) { }

  @Input() category_list: any[] = [];
  user: any = null;
  showSearchMobile = false;

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
        this.user = payload.unique_name || payload.name || payload.sub || null;
      }
    }
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




}
