import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() languageChange = new EventEmitter<string>();

  selectedLanguage: string = 'vi';
  onLanguageChange(): void {
    this.languageChange.emit(this.selectedLanguage);
    localStorage.setItem('selectedLanguage', this.selectedLanguage);
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('selectedLanguage');
    this.selectedLanguage = savedLang || 'vi';
  }

  showoNotification = false;
  showoNotificationt() {
    this.showoNotification = true;
  }
  closeNotification() {
    this.showoNotification = false;
  }
}
