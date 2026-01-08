import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy, OnChanges {

  comments: any[] = [];
  @Input() projectId!: string;
  commentInput: string = "";       // Dùng cho input comment/reply
  replyParentId: string | null = null; // Lưu parentId khi trả lời

  private subscription = new Subscription();

  constructor(private cookieService: CookieService, private _comment: CommentService) { }

  ngOnInit(): void {
    const token = this.cookieService.get('access_token');
    if (!token) return;

    const payload = this.parseJwt(token);
    if (!payload) return;
    this.currentUserId = payload.nameid;
    if (!this.projectId) return;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.projectId)
    this.loadComment();
  }

  loadComment() {
    this.subscription.add(
      this._comment.getData(this.projectId).subscribe((res: any) => {
        this.comments = res;
        // console.log(res);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //#region event

  private parseJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const utf8 = decodeURIComponent(
      decoded
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(utf8);
  }
  currentUserId: string = "";
  addComment(parentId?: string): void {
    const token = this.cookieService.get('access_token');
    if (!token) return alert("Bạn cần đăng nhập");

    const payload = this.parseJwt(token);
    if (!payload) return;

    const comment = {
      projectId: this.projectId,
      authorUserId: payload.nameid,
      content: this.commentInput,
      parentId: parentId || null,
      shouldCreateNotification: false
    };

    this.subscription.add(
      this._comment.postData(comment).subscribe((res: any) => {
        // alert("Thêm bình luận thành công");
        this.commentInput = "";
        this.replyParentId = null;
        this.comments.push(res);
      })
    );
  }

  // Lọc comment cha
  get parentComments(): any[] {
    return this.comments.filter(c => !c.parentId);
  }


}
