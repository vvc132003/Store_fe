import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { ProjectService } from 'src/app/services/project.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-history-comment',
  templateUrl: './history-comment.component.html',
  styleUrls: ['./history-comment.component.scss']
})
export class HistoryCommentComponent implements OnInit, OnDestroy {


  // user: any = {};
  comments: any[] = [];
  showFilter = false;
  isDesktop = true;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  totalPages = 1;
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 5; // mỗi trang 10 item
  pagedData: any[] = [];
  searchText = "";
  transactionType: string | null = null;
  constructor(private _user: UserService,
    private titleService: Title, private cookieService: CookieService,
    private cdr: ChangeDetectorRef,
    private _comment: CommentService,
    private _project: ProjectService,
    private _transaction: TransactionService) { }
  private subscription = new Subscription();



  ngOnInit(): void {
    this.titleService.setTitle("Quản lý bình luận");
    this.loadcomments();
  }


  loadcomments() {
    this.subscription.add(
      this._comment.getHistoryComments().subscribe((data: any[]) => {
        this.comments = data.sort(
          (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
        );
        this.filteredData = [...this.comments];
        this.updatePagedData();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTransactionTypeLabel(type: string) {
    switch (type) {
      case 'DOWNLOAD_CODE': return { label: 'Tải Source Code', class: 'text-primary' };
      case 'TRANSFER': return { label: 'Chuyển tiền', class: 'text-warning' };
      case 'WITHDRAW': return { label: 'Rút tiền', class: 'text-danger' };
      case 'DEPOSIT': return { label: 'Nạp tiền', class: 'text-success' };
      default: return { label: type, class: 'text-secondary' };
    }
  }

  getStatusBadge(status: string) {
    switch (status) {
      case 'SUCCESS':
        return { label: 'Thành công', class: 'badge-success', icon: 'bi-check-circle' };
      case 'FAILED':
        return { label: 'Thất bại', class: 'badge-danger', icon: 'bi-x-circle' };
      case 'PENDING':
        return { label: 'Chờ xử lý', class: 'badge-warning', icon: 'bi-hourglass-split' };
      default:
        return { label: '—', class: 'badge-secondary', icon: 'bi-dash-circle' };
    }
  }




  //#region  event

  onDateFromChange(date: Date) {
    this.dateFrom = date;
    this.applyFilter();
  }

  onDateToChange(date: Date) {
    this.dateTo = date;
    this.applyFilter();
  }
  applyFilter() {
    const text = this.searchText?.toLowerCase().trim() || "";

    this.filteredData = this.comments.filter(item => {
      // 1. Lọc theo text
      const matchText =
        item.content?.toLowerCase().includes(text)||
        item.projectName?.toLowerCase().includes(text);

      // 2. Lọc theo ngày tạo
      const created = new Date(item.transactionDate);

      const from = this.dateFrom ? new Date(this.dateFrom) : null;

      let to = this.dateTo ? new Date(this.dateTo) : null;
      if (to) {
        to.setHours(23, 59, 59, 999); // Bao trọn ngày cuối
      }

      const matchDate = (!from || created >= from) && (!to || created <= to);

    
      return matchText && matchDate;
    });

    this.currentPage = 1;
    this.updatePagedData();
    this.cdr.detectChanges(); // ép Angular check lại dữ liệu ngay

  }

  updatePagedData() {
    const total = Math.ceil(this.filteredData.length / this.pageSize);
    this.totalPages = total > 0 ? total : 1;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }
  goToPage(page: number) {
    if (page < 1) return;
    const totalPages = Math.ceil(this.comments.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }
}
