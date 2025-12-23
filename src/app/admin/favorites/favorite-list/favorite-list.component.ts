import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss']
})
export class FavoriteListComponent implements OnInit, OnDestroy {

  @Input() favorites: any[] = [];
  @Input() favorite_id: any;
  @Output() favoriteclick = new EventEmitter<void>();
  searchText = "";
  filteredData: any[] = [];
  // phân trang
  currentPage = 1;
  pageSize = 6; // mỗi trang 10 item
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

    this.filteredData = this.favorites.filter(item => {

      // 1. Lọc theo text
      const matchText =
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
    if (!Array.isArray(this.favorites)) {
      this.filteredData = [];
      this.pagedData = [];
      return;
    }
    this.filteredData = [...this.favorites];
    if (changes['favorites'] && changes['favorites'].firstChange) {
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
    const totalPages = Math.ceil(this.favorites.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  clickFavorite(category: any) {
    this.favorite_id = category;
    this.favoriteclick.emit(category);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}