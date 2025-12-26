import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit, OnDestroy {


  // user: any = {};
  transactions: any[] = [];
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
  priceFrom: number | null = null;
  priceTo: number | null = null;
  orderCount: number = 0;
  orderCount_year: number = 0;

  transactionType: string | null = null;
  orderCountData: any[] = [];
  revenueData: any[] = [];
  constructor(private _user: UserService,
    private titleService: Title, private cookieService: CookieService,
    private cdr: ChangeDetectorRef,
    private _project: ProjectService,
    private _transaction: TransactionService) { }
  private subscription = new Subscription();

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

  ngOnInit(): void {
    this.titleService.setTitle('Quản lý lịch sử giao dịch');
    const token = this.cookieService.get('access_token');
    const payload = this.parseJwt(token);
    // this.loadUserbyId(payload);
    this.loadTransactionUserId(payload);
  }


  // loadUserbyId(payload: any) {
  //   this.subscription.add(
  //     this._user.getUserById(payload?.nameid).subscribe((data: any) => {
  //       this.user = data;
  //     })
  //   )
  // }

  loadTransactionUserId(payload: any) {
    this.subscription.add(
      this._transaction.getHistoryTransactions(payload.nameid).subscribe((data: any[]) => {
        // this.transactions = data;
        this.transactions = data.sort(
          (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
        );
        this.filteredData = [...this.transactions];
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

    this.filteredData = this.transactions.filter(item => {
      console.log(item);
      // 1. Lọc theo text
      const matchText =
        item.message?.toLowerCase().includes(text);

      // 2. Lọc theo ngày tạo
      const created = new Date(item.transactionDate);

      const from = this.dateFrom ? new Date(this.dateFrom) : null;

      let to = this.dateTo ? new Date(this.dateTo) : null;
      if (to) {
        to.setHours(23, 59, 59, 999); // Bao trọn ngày cuối
      }

      const matchDate = (!from || created >= from) && (!to || created <= to);

      // 3. Lọc theo transactionType
      const matchStatus =
        this.transactionType === null || item.transactionType === this.transactionType;
      return matchText && matchDate && matchStatus;
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
    const totalPages = Math.ceil(this.transactions.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }
}
