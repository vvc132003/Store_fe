import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-message-node',
  templateUrl: './message-node.component.html',
  styleUrls: ['./message-node.component.scss']
})
export class MessageNodeComponent {
  @Input() message: any;
  @Input() allMessages: any[] = [];
  @Input() currentUserId: string = "";
  @Output() replyToMessage = new EventEmitter<any>();

  constructor(private sanitizer: DomSanitizer) { }

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
  deleteMessage(msg: any) {
    // console.log("Gỡ tin nhắn:", msg);
    msg.showMenu = false;
  }
  replyMessage(msg: any) {
    this.replyToMessage.emit(msg);
  }

  getParentMessage(parentId: string): any {
    if (!parentId) return null;
    return this.allMessages?.find(m => m.id === parentId) ?? null;
  }




  getYoutubeEmbedUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeVideoId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    return '';
  }


  extractYoutubeVideoId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : null;
  }


}
