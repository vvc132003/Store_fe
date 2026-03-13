import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { CommentService } from 'src/app/services/comment.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy, OnChanges {

  @Input() currentUser: any = {};

  comments: any[] = [];
  @Input() projectId!: string;
  commentInput: string = "";       // Dùng cho input comment/reply
  replyParentId: string | null = null; // Lưu parentId khi trả lời

  private subscription = new Subscription();

  constructor(private cookieService: CookieService, private _notification: NotificationService, private router: Router, private auth: AuthService, private _comment: CommentService) { }

  ngOnInit(): void {
    // const token = this.cookieService.get('access_token');
    // if (!token) return;

    // const payload = this.parseJwt(token);
    // if (!payload) return;
    // this.currentUserId = payload.nameid;

    // this.subscription.add(
    //   this.auth.me().subscribe({
    //     next: (res: any) => {
    //       this.currentUserId = res.id;
    //       if (!this.projectId) return;
    //       this.loadComment(); // hoặc logic tiếp theo
    //     },
    //     error: () => {
    //       this.currentUserId = '';
    //     }
    //   })
    // );

    this.auth.session().subscribe(isAuth => {
      if (!isAuth) {
        return;
      }
      this.auth.me().subscribe(user => {
        this.currentUserId = user.id;
        // this.loadComment();
      });
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && this.projectId) {
      this.loadComment();
    }
  }
  @Output() lengthComment = new EventEmitter<number>();
  hasPurchased: boolean = true;
  loadComment() {
    this.subscription.add(
      this._comment.getData(this.projectId).subscribe((res: any) => {
        this.comments = res.result;
        this.hasPurchased = res.hasPurchased;
        this.lengthComment.emit(this.comments.filter(c => c.status === "approved").length);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //#region event

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
  addComment(parentId?: string): void {
    if (!this.currentUserId) {
      this.router.navigate(['/dang-nhap']);
    }
    if (!this.hasPurchased) {
      this._notification.showWarning("1040");
      return;
    }

    // nội dung rỗng
    if (!this.commentInput || this.commentInput.trim() === '') {
      this._notification.showWarning("1041");
      return;
    }
    const comment = {
      projectId: this.projectId,
      authorUserId: this.currentUserId,
      content: this.commentInput,
      parentId: parentId || null,
      shouldCreateNotification: false
    };

    this.subscription.add(
      this._comment.postData(comment).subscribe((res: any) => {
        // alert("Thêm bình luận thành công");
        this.commentInput = "";
        this.replyParentId = null;
        this.comments.unshift(res);
      })
    );
  }

  // Lọc comment cha
  get parentComments(): any[] {
    return this.comments.filter(c => !c.parentId);
  }


}
