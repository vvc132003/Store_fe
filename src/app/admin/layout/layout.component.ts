import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnChanges {

  @Input() text: string = "";
  @Output() showPupAdd = new EventEmitter<void>();
  @Input() count: number = 0;
  @Input() tableName: string = "";

  @Input() tabTemplates: { [key: string]: TemplateRef<any> } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabTemplates']) {
      // console.log('Tab templates:', this.tabTemplates); // Kiểm tra xem các TemplateRef có hợp lệ không
    }
  }


  selectedLanguage: string = 'vi';
  onLanguageChange(event: any): void {
    this.selectedLanguage = event;
  }


  
  @Output() showButtonss = new EventEmitter<any[]>();
  @Input() buttonNone: any[] = [];

  evetnbuttons(event: any) {
    this.showButtonss.emit(event);
  }

  //#region  event

  onChildClick(event: any) {
    this.showPupAdd.emit(event);
  }


}
