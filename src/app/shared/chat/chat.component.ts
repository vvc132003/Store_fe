import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ConversationService } from 'src/app/services/conversation.service';
import { AuthService } from 'src/app/services/AuthService';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, OnChanges {

  isShowChat: boolean = false;
  showChat: boolean = false;
  showButton: boolean = false
  toggleChat() {
    this.isShowChat = true;
    setTimeout(() => {
      this.showChat = true;
      this.showButton = false;
      if (window.innerWidth <= 470) {
        this.isChatSidebarVisible = true;
        this.isChatMainVisible = false;
      } else {
        this.isChatSidebarVisible = true;
        this.isChatMainVisible = true;
      }

    }, 0);
    // if (this.showChat == true) {
    this.scrollToBottom();
    setTimeout(() => {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 200);
    // }
  }
  conversations: any[] = [
    // {
    //   name: 'Nguyễn Văn A',
    //   avatar: 'https://i.pravatar.cc/150?img=3',
    //   lastMessage: 'Bạn còn hàng không?',
    //   messages: [
    //     { text: 'Chào bạn, shop còn hàng không?', fromSelf: false },
    //     { text: 'Dạ còn bạn nhé!', fromSelf: true }
    //   ]
    // },
    // {
    //   name: 'Trần Thị B',
    //   avatar: 'https://i.pravatar.cc/150?img=5',
    //   lastMessage: 'Ship về Hà Nội bao lâu?',
    //   messages: [
    //     { text: 'Shop ơi, ship về Hà Nội bao lâu?', fromSelf: false },
    //     { text: 'Tầm 2-3 ngày bạn nhé.', fromSelf: true }
    //   ]
    // }
  ];
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
  currentUserId: string = "";
  private subscription: Subscription = new Subscription();

  constructor(private datePipe: DatePipe, private auth: AuthService, private conversationService: ConversationService, private cookieService: CookieService, private cdr: ChangeDetectorRef) {

    this.subscription.add(
      this.auth.me().subscribe((res: any) => {
        this.currentUserId = res.id;
        this.showButton = true;
      })
    )
    // console.log(this.currentUserId);
  }

  //#region  load

  ngOnInit(): void {
    // this.fetChat();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.conversationService.stopConnection1();
    this.conversationService.stopConnection2();
  }


  @Input() data: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      const filtered = this.data.filter((conv: any) => conv.name !== 'Bot');
      this.conversations = filtered;
      this.allConversations = filtered;
      // this.selectedConversation = this.conversations[0];
      if (filtered.length > 0 && filtered[0]) {
        this.selectedConversation = filtered[0];
        this.getMess(this.selectedConversation);
        this.loadsoket(this.selectedConversation);
      } else {
        this.selectedConversation = null;
      }
    }
  }


  // fetChat() {
  //   this.subscription.add(
  //     this.conversationService.postData_Chat().subscribe((data: any) => {
  //       // this.conversations = data;
  //       // this.selectedConversation = this.conversations[0];
  //       if (data === true) {
  //         this.conversationService.getConversations().subscribe((data: any) => {
  //           const filtered = data.filter((conv: any) => conv.name !== 'Bot');
  //           this.conversations = filtered;
  //           this.allConversations = filtered;
  //           // console.log(data);
  //           this.selectedConversation = this.conversations[0];
  //           this.getMess(filtered[0]);
  //           this.loadsoket(this.selectedConversation);
  //           // this.cdr.detectChanges();
  //         })
  //       }
  //     })
  //   )
  // }

  //#region add tin nhắn và cuộc hội thoại

  newMess(data: any) {
    // console.log("ok");
    // console.log(data);
    // this.conversations.unshift(data);
    // if (this.newMessage.trim()) {
    // const index = this.conversations.findIndex(c => c.conversationId === data.conversationId);
    // if (index !== -1) {
    //   const conversation = this.conversations[index];
    //   conversation.lastMessage = data.lastMessage;
    //   conversation.updatedAt = new Date(); 
    //   this.conversations.splice(index, 1);
    //   this.conversations.unshift(conversation);
    // }

    this.listmessage.messages = [
      ...this.listmessage.messages,
      { id: data.id, text: data.content, senderMemberId: data.senderMemberId, messageType: data.messageType, parentId: data.parentId, createdAt: data.createdAt, fullename: data.fullename }
    ];
    // console.log(this.listmessage.messages);

    /// người gửi thì mới laod newmessage
    if (data.senderMemberId === this.currentUserId) {
      this.newMessage = '';
    }

    this.scrollToBottom();
    // }
  }

  neworupdateConversation(data: any) {
    // console.log(data);
    const index = this.conversations.findIndex(
      c => String(c.conversationId) === String(data.conversationId)
    );

    if (index !== -1) {
      const conversation = this.conversations[index];
      conversation.lastMessage = data.lastMessage;
      conversation.updatedAt = new Date();
      conversation.messageType = data.messageType;
      conversation.createdAt = data.createdAt;

      this.conversations.splice(index, 1);
      this.conversations.unshift(conversation);
    } else {
      data.updatedAt = new Date();
      this.conversations.unshift(data);
    }
    // const index = this.conversations.findIndex(co => co.conversationId === data.conversationId);
    // data.lastMessage = data.lastMessage;
    // if (index === -1) {
    //   this.conversations.unshift(data);
    // } else {
    //   this.conversations[index] = data;
    // }
  }


  //#region  load tin nhắn

  selectedConversation = this.conversations[0];
  newMessage = '';

  showSidebar: boolean = true;
  // listmessage: any = [];
  listmessage: any = {
    messages: []
  };

  @ViewChild('messageInput') messageInput!: ElementRef;

  selectConversation(convo: any) {
    this.stopAndStartConnection(convo);
    setTimeout(() => {
      this.messageInput.nativeElement.focus();
    }, 0);
    this.isTyping = false;
  }

  async stopAndStartConnection(convo: any) {
    await this.conversationService.stopConnection1();
    await this.conversationService.stopConnection2();

    this.selectedConversation = convo;
    this.currentPage = 1;
    this.getMess(convo);
    this.loadsoket(convo);
    // this.scrollToBottom();
    if (window.innerWidth <= 470) {
      this.isChatSidebarVisible = false;
      this.isChatMainVisible = true;
    } else {
      // Màn rộng thì hiển thị cả 2
      this.isChatSidebarVisible = true;
      this.isChatMainVisible = true;
    }
  }

  // getMess(convo: any) {
  //   this.conversationService.getMessages(convo.conversationId).subscribe((res: any) => {
  //     this.listmessage = res[0];
  //     // console.log(res);
  //   })
  // }
  // listmessage: any[] = [];

  currentPage: number = 1;
  pageSize: number = 100;
  isLoading: boolean = false;

  getMess(convo: any, loadMore: boolean = false) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.conversationService.getMessages(convo.conversationId, this.currentPage, this.pageSize).subscribe((res: any) => {
      const newMessages = res[0].messages;

      if (loadMore) {
        const chatElement = this.chatContent.nativeElement;
        const oldScrollHeight = chatElement.scrollHeight;
        this.listmessage.messages = [...newMessages, ...this.listmessage.messages];
        setTimeout(() => {
          const newScrollHeight = chatElement.scrollHeight;
          chatElement.scrollTop = newScrollHeight - oldScrollHeight;
          this.isLoading = false;
        }, 0);
        // console.log("1");
      } else {
        this.listmessage.messages = newMessages;
        this.isLoading = false;
        this.scrollToBottom();
        // console.log("2", this.listmessage.messages);
      }
    });
  }

  onScroll() {
    if (!this.chatContent) return;
    const chatElement = this.chatContent.nativeElement;
    if (chatElement.scrollTop === 0 && !this.isLoading) {
      this.loadMoreMessages(this.selectedConversation);
    }
  }

  loadMoreMessages(convo: any) {
    this.currentPage++;
    this.pageSize = 10;
    this.getMess(convo, true);
  }


  loadsoket(data: any) {
    // console.log(this.currentUserId);
    this.subscription.add(
      this.conversationService.startConnection1(data.conversationId).subscribe(() => {
        this.conversationService.onaddupChat().subscribe((newMes: any) => {
          this.newMess(newMes);
        });
      })
    );
    this.subscription.add(
      this.conversationService.startConnection2(this.currentUserId).subscribe(() => {
        this.conversationService.loadConversation().subscribe((data: any) => {
          this.neworupdateConversation(data);
        })
        this.conversationService.logTyping().subscribe((res: any) => {
          if (res.userId !== this.currentUserId && res.conversationId === data.conversationId) {
            this.isTyping = res.isTyping;
          } else {
            this.isTyping = false;
          }
        });
      })
    )
  }

  @ViewChild('chatContent') chatContent!: ElementRef;
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContent) {
        const chatElement = this.chatContent.nativeElement;
        chatElement.scrollTop = chatElement.scrollHeight;
      }
    }, 50);
  }

  // scrollToBottom() {
  //   setTimeout(() => {
  //     const list = document.getElementById('messageList');
  //     if (list) {
  //       list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  //     }
  //   }, 100); // delay một chút để chờ DOM render
  // }


  //#region  search cuộc trò chuyện

  searchTerm: string = '';
  allConversations: any[] = [];
  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.conversations = this.allConversations.filter(c =>
      c.name.toLowerCase().includes(term)
    );
  }


  //#region  send tn

  sendMessage() {
    // if (this.newMessage.trim()) {
    //   this.selectedConversation.messages.push({ text: this.newMessage, fromSelf: true });
    //   this.newMessage = '';
    //   setTimeout(() => {
    //     const list = document.getElementById('messageList');
    //     list?.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
    //   });
    // }
    if (!this.replyaddToMessage || !this.replyaddToMessage.id) {
      this.createChat();
    } else {
      this.createreplyMessage();
    }

  }


  createChat() {
    const data = {
      content: this.newMessage || this.iamge,
      conversationId: this.selectedConversation.conversationId,
      senderMemberId: this.currentUserId,
    }
    this.conversationService.postChat(data).subscribe((data) => {
      // console.log();
      this.onTyping();
      this.previewImageUrls = [];
    })
  }

  createreplyMessage() {
    const data = {
      content: this.newMessage || this.iamge || "trả lời",
      conversationId: this.selectedConversation.conversationId,
      senderMemberId: this.currentUserId,
      parentId: this.replyaddToMessage.id,
    }
    this.conversationService.postChatReply(data).subscribe((data) => {
      this.replyaddToMessage = null;
      this.onTyping();
      this.previewImageUrls = [];
    })
  }

  //#region  nhận biết người nào đang nhập tin nhắn

  isTyping: boolean = false;

  typingTimer: any;
  lastIsTyping: boolean = false;

  onTyping() {
    const message = this.newMessage?.trim() || '';
    const isTyping = message.length > 0;

    if (isTyping === this.lastIsTyping) return;

    this.lastIsTyping = isTyping;

    if (!isTyping) {
      clearTimeout(this.typingTimer);
      this.sendTypingStatus(false);
    } else {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.sendTypingStatus(true);
      }, 2000);
    }
  }

  sendTypingStatus(isTyping: boolean) {
    const data = {
      conversationId: this.selectedConversation?.conversationId,
      userId: this.currentUserId,
      isTyping: isTyping,
    };

    if (data.conversationId) {
      this.conversationService.postlogTyping(data).subscribe();
    }
  }


  //#region event

  closeChat() {
    this.showChat = false;
    setTimeout(() => {
      this.isShowChat = false;
      this.showButton = true;
    }, 200);
  }

  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string) {
    this.newMessage += emoji;
    this.showEmojiPicker = false;
  }

  previewImageUrls: string[] = [];
  selectedImageFiles: File[] = [];
  iamge: string = '';
  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.previewImageUrls = [];
    this.selectedImageFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith('image/')) {
        this.selectedImageFiles.push(file);

        const reader = new FileReader();

        reader.onload = () => {
          const base64 = reader.result as string;
          this.previewImageUrls.push(base64);
          this.iamge = base64;
          this.sendMessage();
        };

        reader.readAsDataURL(file);
      }
    }
  }

  onVideosSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.iamge = URL.createObjectURL(file);
      this.sendMessage();
    }
  }

  isChatMainVisible: boolean = false;
  isChatSidebarVisible: boolean = false;


  backToSidebar() {
    this.isChatSidebarVisible = true;
    this.isChatMainVisible = false;
  }

  removeImage(index: number) {
    this.previewImageUrls.splice(index, 1);
    this.selectedImageFiles.splice(index, 1);
  }

  //#region evetn gỡ tn
  showMenu: boolean = false;
  menuMessage: any = null;

  toggleMenu(msg: any): void {
    if (this.menuMessage === msg) {
      this.showMenu = !this.showMenu;
    } else {
      this.menuMessage = msg;
      this.showMenu = true;
    }
  }

  closeMenu(): void {
    this.showMenu = false;
    this.menuMessage = null;
  }

  cancelReply() {
    this.replyaddToMessage = null;
  }

  deleteMessage(msg: any) {
    // console.log("Gỡ tin nhắn:", msg);
    msg.showMenu = false;
  }


  replyaddToMessage: any = null;

  replyMessage(msg: any) {

    this.replyaddToMessage = msg;
    // console.log(this.replyToMessage.id);
    setTimeout(() => {
      this.messageInput.nativeElement.focus();
    }, 0);
    // const data = {
    //   content: this.newMessage || this.iamge || "trả lời",
    //   conversationId: this.selectedConversation.conversationId,
    //   senderMemberId: this.currentUserId,
    //   parentId: msg.id
    // }

    // this.conversationService.postChatReply(data).subscribe((data) => {
    //   this.onTyping();
    //   this.previewImageUrls = [];
    // })

  }

  //#region  nt zalo

  openZaloAppChat() {
    const zaloNumber = '84373449865';
    const zaloAppUrl = `zalo://chat?phone=${zaloNumber}`;
    const zaloWebUrl = `https://zalo.me/${zaloNumber}`;

    // Mở zalo app
    window.location.href = zaloAppUrl;

    // Có thể set timeout kiểm tra nếu không mở được app thì mở web
    setTimeout(() => {
      window.open(zaloWebUrl, '_blank');
    }, 2000);
  }


  /// tính thời gian

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

}

