import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit, OnDestroy {

  @Input() users: any[] = [];
  @Input() user_id: any;
  @Output() categoryclick = new EventEmitter<void>();
  searchText = "";
  filteredData: any[] = [];
  // phân trang
  currentPage = 1;
  pageSize = 6; // mỗi trang 10 item
  pagedData: any[] = [];
  constructor(private cdr: ChangeDetectorRef, private _notification: NotificationService, private _user: UserService) { }
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

    this.filteredData = this.users.filter(item => {

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


  ngOnChanges(changes: SimpleChanges) {
    if (!Array.isArray(this.users)) {
      this.filteredData = [];
      this.pagedData = [];
      return;
    }
    this.filteredData = [...this.users];
    if (changes['users'] && changes['users'].firstChange) {
      this.currentPage = 1;
    }
    this.updatePagedData();
  }
  // onSearch() {
  //   //  console.log(this.searchText);
  //   const text = this.searchText.toLowerCase().trim();

  //   this.filteredData = this.bear_type.filter(item =>
  //     (item.code?.toLowerCase().includes(text)) ||
  //     (item.name?.toLowerCase().includes(text)) ||
  //     (item.displayName?.toLowerCase().includes(text)) ||
  //     (item.notes?.toLowerCase().includes(text))
  //   );

  //   this.currentPage = 1; // quay về trang 1
  //   this.updatePagedData();
  // }

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
    const totalPages = Math.ceil(this.users.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  clickCategory(category: any) {
    this.user_id = category;
    this.categoryclick.emit(category);
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