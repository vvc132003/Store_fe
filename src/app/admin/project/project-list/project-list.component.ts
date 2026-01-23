import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnChanges, OnInit, OnDestroy {

  @Input() project_list: any[] = [];
  @Input() project_id: any;
  @Output() projectclick = new EventEmitter<void>();
  @Output() dblclick = new EventEmitter<void>();

  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  searchText = "";
  priceFrom: number | null = null;
  priceTo: number | null = null;
  size: string = '';
  status: boolean | null = null; // mặc định là null để "Tất cả" được chọn
  showFilter = false;
  isDesktop = true;
  private subscription = new Subscription();
  constructor(private cdr: ChangeDetectorRef, private _project: ProjectService) { }


  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (!Array.isArray(this.project_list)) {
      this.filteredData = [];
      this.pagedData = [];
      return;
    }
    this.filteredData = [...this.project_list];
    if (changes['project_list'] && changes['project_list'].firstChange) {
      this.currentPage = 1;
    }
    this.updatePagedData();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  //#region event
  onEdit(item: any) {
    // console.log('Cập nhật:', item);
    // this.bear_product = { ...item }; // đổ dữ liệu lên form
  }

  onDelete(id: number) {
    if (confirm('Bạn có chắc chắn muốn xoá gấu bông này không?')) {
      console.log('Xoá ID:', id);
      // Gọi API xoá tại đây
      // this.bearService.delete(id).subscribe(...)
    }
  }

  goToPage(page: number) {
    if (page < 1) return;
    const totalPages = Math.ceil(this.project_list.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  totalPages = 1;
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 10; // mỗi trang 10 item
  pagedData: any[] = [];

  updatePagedData() {
    const total = Math.ceil(this.filteredData.length / this.pageSize);
    this.totalPages = total > 0 ? total : 1;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }


  toggleFilter() {
    this.showFilter = !this.showFilter;
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

    this.filteredData = this.project_list.filter(item => {

      // 1. Lọc theo text
      const matchText =
        item.title?.toLowerCase().includes(text);

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
  clickProject(project: any) {
    this.project_id = project;
    this.projectclick.emit(project);
  }

  dblclickProject() {
    this.dblclick.emit();
  }

  toggleStatus(item: any) {

    this.subscription.add(
      this._project.toggleStatusPr(item.id).subscribe((data: any) => {
        // this._notification.showSuccess("1010");
        this.project_id.status = data.status;
      })
    )
  }

}
