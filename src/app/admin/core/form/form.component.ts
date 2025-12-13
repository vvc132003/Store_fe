import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() headerDiv?: any;
  // @Input() categoryContent: TemplateRef<any[]> | null = null;
  @Input() tabTemplates: { [key: string]: TemplateRef<any> } = {};
  // @Input() extraContent: TemplateRef<any> | null = null;
  @Input() text: string = "";
  // @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;
  // @ViewChild('extraContainer', { read: ViewContainerRef }) extraContainer!: ViewContainerRef;

  tags: any[] = [];
  @Input() showoffcanvas = false;

  isLargeScreen: boolean = window.innerWidth > 470;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isLargeScreen = window.innerWidth > 470;
  }
  constructor(private cdr: ChangeDetectorRef, private _tags: TagsService) { }
  private subscription = new Subscription();

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags() {
    this.subscription.add(
      this._tags.getData().subscribe((data: any) => {
        this.tags = data;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  //// 

  showTagList = false;
  @Input() showTags = true;


  // tags = [
  //   { id: '1', name: 'Angular' },
  //   { id: '2', name: '.NET' },
  //   { id: '3', name: 'MongoDB' },
  //   { id: '4', name: 'SaaS' }
  // ];

  toggleTagList() {
    this.showTagList = !this.showTagList;
  }
  selectedTags: any[] = [];

  selectTag(tag: any) {
    const exists = this.selectedTags.find(t => t.id === tag.id);
    if (!exists) {
      this.selectedTags.push(tag);
    }
    this.showTagList = false;
  }

  removeTag(tag: any) {
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
  }
}