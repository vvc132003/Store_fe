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

  constructor(private _comment: CommentService, private cookieService: CookieService) { }

  toggleReplyInput() {
    this.showReplyInput = !this.showReplyInput;
    this.replyInput = "";
  }

  getReplies(): any[] {
    return this.comments.filter(c => c.parentId === this.comment.id);
  }

  addReply() {
    if (!this.replyInput.trim()) return;

    const newComment = {
      projectId: this.comment.projectId,
      userId: this.currentUserId,
      content: this.replyInput,
      parentId: this.comment.id
    };

    this._comment.postData(newComment).subscribe((res: any) => {
      this.replyInput = "";
      this.showReplyInput = false;
        this.comments.push(res);
    });
  }
}
