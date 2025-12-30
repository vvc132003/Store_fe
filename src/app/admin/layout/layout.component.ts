import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/services/conversation.service';
import { SettingsService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnChanges, OnInit, OnDestroy {

  @Input() text: string = "";
  @Output() showPupAdd = new EventEmitter<void>();
  @Input() count: number = 0;
  @Input() tableName: string = "";

  @Input() tabTemplates: { [key: string]: TemplateRef<any> } = {};
  constructor(private conversationService: ConversationService, private _setting: SettingsService) {

  }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadInitialChat();
    this.loadSetting();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabTemplates']) {
      // console.log('Tab templates:', this.tabTemplates); // Kiểm tra xem các TemplateRef có hợp lệ không
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  conversations: any[] = [];

  loadInitialChat() {
    this.subscription.add(
      this.conversationService.postData_Chat().subscribe((data: any) => {
        this.conversationService.getConversations().subscribe((data: any) => {
          this.conversations = data;
        });
      })
    )
  }

  @Output() dataEvent = new EventEmitter<any>();


  settings: any[] = [];
  loadSetting() {
    this.subscription.add(
      this._setting.getData().subscribe((res: any) => {
        this.settings = res;
        this.dataEvent.emit(res);
      })
    )
  }

}
