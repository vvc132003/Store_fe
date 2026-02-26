import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { SettingsService } from 'src/app/services/setting.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-layout-home',
  templateUrl: './layout-home.component.html',
  styleUrls: ['./layout-home.component.scss']
})
export class LayoutHomeComponent implements OnInit, OnDestroy {

  @Output() categoryChange = new EventEmitter<any[]>();
  @Input() tabTemplates: { [key: string]: TemplateRef<any> } = {};
  @Input() balance: number = 0;
  logo: string = "";

  category_list: any[] = [];

  constructor(private _category: CategoryService, private _setting: SettingsService, private _user: UserService, private conversationService: ConversationService) {

  }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadcategory_list();
    // this.loadInitialChat();
    this.loadSetting();
  }
  loadcategory_list() {
    this.subscription.add(
      this._category.getData().subscribe((data: any) => {
        this.category_list = data.slice(0, 11);
        this.categoryChange.emit(this.category_list);
        // console.log(data);
      })
    )
  }

  settings: any[] = [];
  @Output() logoChange = new EventEmitter<string>();
  loadSetting() {
    this.subscription.add(
      this._setting.getData().subscribe((res: any) => {
        this.settings = res;
        this.logo = res?.data?.SiteSettings?.logo ?? "";
        this.logoChange.emit(this.logo);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  conversations: any[] = [];

  loadInitialChat() {
    this.subscription.add(
      this.conversationService.createConversation().subscribe((data: any) => {
        this.conversationService.getConversations().subscribe((data: any) => {
          this.conversations = data;
        });
      })
    )
  }

  currentUser: any;
  @Output() userLoaded = new EventEmitter<any>();

  onUserLoaded(user: any) {
    this.currentUser = user;
    this.loadInitialChat();
    this.userLoaded.emit(this.currentUser);
  }

}
