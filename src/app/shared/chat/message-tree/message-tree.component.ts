import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-message-tree',
  templateUrl: './message-tree.component.html',
  styleUrls: ['./message-tree.component.scss']
})
export class MessageTreeComponent implements OnChanges {
  @Input() listmessage: any[] = [];
  @Input() currentUserId: string = "";
  @Output() replyToMessage = new EventEmitter<any>();

  tree: any[] = [];

  showMenu: boolean = false;
  menuMessage: any = null;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listmessage'] && changes['listmessage'].currentValue) {
      // console.log(this.listmessage);
      const raw = changes['listmessage'].currentValue;
      this.listmessage = Array.isArray(raw) ? raw : Object.values(raw);
      // this.tree = this.buildMessageTree(this.listmessage, null);
      // console.log(this.listmessage);

    }
  }
  buildMessageTree(messages: any[], parentId: string | null): any[] {
    // console.log(messages);
    return messages
      .filter(msg => msg.parentId === parentId)
      .map(msg => ({
        ...msg,
        children: this.buildMessageTree(messages, msg.id)
      }));
  }

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


  deleteMessage(msg: any) {
    // console.log("Gỡ tin nhắn:", msg);
    msg.showMenu = false;
  }

  replyMessage(msg: any) {
    this.replyToMessage.emit(msg);
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

}