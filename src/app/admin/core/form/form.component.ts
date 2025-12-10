import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements AfterViewInit {
  @Input() headerDiv?: any;
  // @Input() categoryContent: TemplateRef<any[]> | null = null;
  @Input() tabTemplates: { [key: string]: TemplateRef<any> } = {};
  // @Input() extraContent: TemplateRef<any> | null = null;
  @Input() text: string = "";
  // @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;
  // @ViewChild('extraContainer', { read: ViewContainerRef }) extraContainer!: ViewContainerRef;


  @Input() showoffcanvas = false;

  isLargeScreen: boolean = window.innerWidth > 470;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isLargeScreen = window.innerWidth > 470;
  }
  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }



  //#region  event
  selectedTab: string = 'category';
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  @Output() closePupAdd = new EventEmitter<void>();

  close() {
    this.showoffcanvas = false;
    this.closePupAdd.emit();
  }

}
