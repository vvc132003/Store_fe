import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  @Input() category: any[] = [];
  @Input() category_id: any;
  @Output() categoryclick = new EventEmitter<void>();
  searchText = "";
  filteredData: any[] = [];
  // phân trang
  currentPage = 1;
  pageSize = 6; // mỗi trang 10 item
  pagedData: any[] = [];
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.filteredData = [...this.bear_type];

    this.updatePagedData();
    this.checkScreen();

    window.addEventListener('resize', () => this.checkScreen());

  }


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

    this.filteredData = this.category.filter(item => {

      // 1. Lọc theo text
      const matchText =
        item.code?.toLowerCase().includes(text) ||
        item.name?.toLowerCase().includes(text) ||
        item.displayName?.toLowerCase().includes(text) ||
        item.notes?.toLowerCase().includes(text);

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
    if (!Array.isArray(this.category)) {
      this.filteredData = [];
      this.pagedData = [];
      return;
    }
    this.filteredData = [...this.category];
    if (changes['category'] && changes['category'].firstChange) {
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
    const totalPages = Math.ceil(this.category.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  clickCategory(category: any) {
    this.category_id = category;
    this.categoryclick.emit(category);
  }
}
