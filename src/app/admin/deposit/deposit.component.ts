import { ChangeDetectorRef, Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit, OnDestroy {

  transactions: any[] = [];
  transaction_id: any;
  searchText = "";
  filteredData: any[] = [];
  count: number = 0;
  // phân trang
  currentPage = 1;
  pageSize = 6; // mỗi trang 10 item
  pagedData: any[] = [];
  constructor(private cdr: ChangeDetectorRef, private titleService: Title, private _notification: NotificationService, private _user: UserService,
    private _transaction: TransactionService
  ) { }
  private subscription = new Subscription();


  ngOnInit(): void {
    this.titleService.setTitle("Quản lý giao dịch nạp tiền");
    this.loaTransactions();
    this.checkScreen();

    window.addEventListener('resize', () => this.checkScreen());

  }

  loaTransactions() {
    this.subscription.add(
      this._transaction.getWithdrawTransactions().subscribe((res: any[]) => {
        res.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
        this.transactions = res;
        this.transaction_id = res[0];
        this.count = res.length;
        this.filteredData = [...res];
        this.updatePagedData();
      })
    )
  }

  getTransactionTypeLabel(type: string) {
    switch (type) {
      case 'DOWNLOAD_CODE': return { label: 'Tải mã nguồn', class: 'text-primary' };
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



  //#region event

  checkScreen() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth > 470;

    if (this.isDesktop && !wasDesktop) {
      this.showFilter = true; // desktop luôn hiện filter
    }
    // mobile: không reset showFilter → bàn phím không làm filter biến mất
  }


  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  status: boolean | null = null; // mặc định là null để "Tất cả" được chọn
  showFilter = false;
  isDesktop = true;

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  openDatePicker(field: 'from' | 'to') {
    // dùng thư viện như Flatpickr hoặc ngx-bootstrap datepicker
    // khi chọn xong sẽ cập nhật dateFrom hoặc dateTo
  }

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

      // 1. Lọc theo text
      const matchText =
        item.code?.toLowerCase().includes(text) ||
        item.email?.toLowerCase().includes(text) ||
        item.fullName?.toLowerCase().includes(text) ||
        item.fullName?.toLowerCase().includes(text);

      // 2. Lọc theo ngày tạo
      const created = new Date(item.createdAt);

      const from = this.dateFrom ? new Date(this.dateFrom) : null;

      let to = this.dateTo ? new Date(this.dateTo) : null;
      if (to) {
        to.setHours(23, 59, 59, 999); // Bao trọn ngày cuối
      }

      const matchDate = (!from || created >= from) && (!to || created <= to);

      // 3. Lọc theo trạng thái (ép kiểu boolean)
      const matchStatus =
        this.status === null || item.isActive === (this.status === true);

      return matchText && matchDate && matchStatus;
    });

    this.currentPage = 1;
    this.updatePagedData();
    this.cdr.detectChanges(); // ép Angular check lại dữ liệu ngay

  }

  // ⚡ Cập nhật dữ liệu cho trang hiện tại
  totalPages = 1;

  updatePagedData() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }


  // ⚡ Chuyển trang
  goToPage(page: number) {
    if (page < 1) return;
    const totalPages = Math.ceil(this.transactions.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  clickCategory(category: any) {
    this.transaction_id = category;
  }

  toggleStatus(user: any) {
    if (user.role === "admin") {
      this._notification.showWarning("1009");
      return;
    }
    this.subscription.add(
      this._user.toggleStatusUser(user.id).subscribe((data: any) => {
        this._notification.showSuccess("1010");
        user.status = data.status;
      })
    )
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}