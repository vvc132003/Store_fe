import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {

  @Input() orders: any[] = [];
  @Input() order_id: any;
  @Output() orderclick = new EventEmitter<void>();
  searchText = "";
  filteredData: any[] = [];
  // phân trang
  currentPage = 1;
  pageSize = 10; // mỗi trang 10 item
  pagedData: any[] = [];
  constructor(private cdr: ChangeDetectorRef, private _notification: NotificationService) { }
  private subscription = new Subscription();


  ngOnInit(): void {
    // this.filteredData = [...this.bear_type];

    this.updatePagedData();
    this.checkScreen();

    window.addEventListener('resize', () => this.checkScreen());

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

    this.filteredData = this.orders.filter(item => {

      // 1. Lọc theo text
      const matchText =
        item.fullName?.toLowerCase().includes(text) ||
        item.title?.toLowerCase().includes(text) ||
        item.categoryName?.toLowerCase().includes(text) ||
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


  ngOnChanges(changes: SimpleChanges) {
    if (!Array.isArray(this.orders)) {
      this.filteredData = [];
      this.pagedData = [];
      return;
    }
    this.filteredData = [...this.orders];
    if (changes['orders'] && changes['orders'].firstChange) {
      this.currentPage = 1;
    }
    this.updatePagedData();
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
    const totalPages = Math.ceil(this.orders.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  clickOrder(order: any) {
    this.order_id = order;
    this.orderclick.emit(order);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}