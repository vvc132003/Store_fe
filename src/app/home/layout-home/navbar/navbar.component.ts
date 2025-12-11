import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  showSearchMobile = false;

  toggleMobileSearch() {
    this.showSearchMobile = !this.showSearchMobile;
  }

  showMenuOpenMobile = false;

  toggleMobileMenu() {
    this.showMenuOpenMobile = !this.showMenuOpenMobile;
  }


}
