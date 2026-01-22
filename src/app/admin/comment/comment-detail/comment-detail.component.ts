import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent implements OnChanges, OnDestroy {
  @Input() comment: any;
  @Input() showoffcanvas: boolean = false;
  @Input() comments_list: any[] = [];
  filteredComments: any[] = [];

  @Output() closeDetail = new EventEmitter<void>();
  @Input() currentUser: any = {};
  currentUserId: string = "";

  text: string = "";

  constructor(private cookieService: CookieService, private auth: AuthService,) { }
  private subscription = new Subscription();


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

  ngOnChanges(changes: SimpleChanges): void {
    this.auth.me().subscribe({
      next: (res: any) => {
        this.currentUserId = res.id;
      },
      error: () => {
        this.currentUserId = '';
      }
    })

    if (!changes['comment'] && this.comment) {
      this.text = "Xem chi tiết: " + this.comment.projectName;
    }
    if (!changes['comments_list'] && this.comments_list) {
      this.filteredComments = this.comments_list.filter(c => c.projectId == this.comment.projectId);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get parentComments(): any[] {
    return this.filteredComments.filter(c => !c.parentId);
  }

  //#region event
  close() {
    this.closeDetail.emit();
  }

}
