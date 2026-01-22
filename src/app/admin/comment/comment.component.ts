import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {


  compent_id: any;
  comments: any[] = [];
  comments_list: any[] = []; /// dùng để lưu tất cả comment tạm thời để sử dụng trong comment detail

  countComment: number = 0;
  newComment: any = {};
  showCommentDetail: boolean = false;

  constructor(private _comment: CommentService, private datePipe: DatePipe, private titleService: Title) { }

  private subscription = new Subscription();



  ngOnInit(): void {
    this.titleService.setTitle('Quản lý bình luận');
    this.loadComment();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadComment() {
    this.subscription.add(
      this._comment.getData().subscribe((res: any[]) => {
        this.comments_list = res;
        this.comments = res.filter(c => c.parentId == null);
        this.compent_id = this.comments[0];
        this.countComment = this.comments.length;
      })
    );
  }

  //#region event

  selectpComment(event: any) {
    this.compent_id = event;
  }

  click(event: any) {
    // this.isModalVisible = true;

    const modalMap: { [key: string]: () => void } = {
      '101': () => setTimeout(() => this.showCommentDetail = true, 0),

    };

    const openModal = modalMap[event];
    if (openModal) {
      openModal();
    }
    switch (event) {
      case '101':
        const found = this.comments.find(dr => dr.id == this.compent_id.id);
        if (!found) return;
        this.newComment = found;
        setTimeout(() => this.showCommentDetail = true, 100);
        break;
      case '102':
        this.subscription.add(
          this._comment.updateStatus(this.compent_id.id, 'approved')
            .subscribe(() => {
              const found = this.comments.find(dr => dr.id == this.compent_id.id);
              if (found) {
                found.status = 'approved';
              }
            })
        )
        break;
      case '105':
        this.subscription.add(
          this._comment.updateStatus(this.compent_id.id, 'rejected')
            .subscribe(() => {
              const found = this.comments.find(dr => dr.id == this.compent_id.id);
              if (found) {
                found.status = 'rejected';
              }
            })
        )
        break;

      default:
        break;
    }
  }



  close() {
    this.showCommentDetail = false;
  }

}