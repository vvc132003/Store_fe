import { Component, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {
  @Input() comment: any;
  @Input() comments: any[] = [];
  @Input() currentUserId: string = "";
  replyInput: string = "";
  showReplyInput: boolean = false;
  @Input() currentUser: any = {};


  constructor(private _comment: CommentService, private cookieService: CookieService) { }

  toggleReplyInput(comment: any) {
    this.comments.forEach(c => {
      if (c !== comment) c.showReplyInput = false; // đóng comment khác
    });

    comment.showReplyInput = !comment.showReplyInput;
    comment.replyInput = "";
  }


  getReplies(): any[] {
    return this.comments.filter(c => c.parentId === this.comment.id);
  }

  addReply(userId: string) {
    if (!this.replyInput.trim()) return;

    const newComment = {
      projectId: this.comment.projectId,
      authorUserId: this.currentUserId,
      content: this.replyInput,
      parentId: this.comment.id,
      shouldCreateNotification: true,
      repliedUserId: userId

    };

    this._comment.postData(newComment).subscribe((res: any) => {
      this.replyInput = "";
      this.showReplyInput = false;
      this.comments.push(res);
    });
  }
}
