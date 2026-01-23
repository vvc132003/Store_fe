import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  count: number = 0;
  showtags_add: boolean = false;
  newTag: any = {};
  tags: any[] = [];
  data: any = {};
  isDesktop = true;
  showFilter = false;
  currentPage = 1;
  status: boolean | null = null;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  searchText = "";
  filteredData: any[] = [];
  pageSize = 6; // mỗi trang 10 item
  pagedData: any[] = [];
  tag_id: any = {};
  private subscription = new Subscription();

  constructor(private _tag: TagsService, private cdr: ChangeDetectorRef) { }



  //#region load

  ngOnInit(): void {
    this.subscription.add(
      this._tag.getData().subscribe((res: any[]) => {
        this.count = res.length;
        this.tags = res.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.tag_id = this.tags[0];
        this.filteredData = this.tags;
        this.currentPage = 1;
        this.updatePagedData();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //#region event

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
  onDateToChange(date: Date) {
    this.dateTo = date;
    this.applyFilter();
  }
  onDateFromChange(date: Date) {
    this.dateFrom = date;
    this.applyFilter();
  }
  applyFilter() {
    const text = this.searchText?.toLowerCase().trim() || "";

    this.filteredData = this.tags.filter(item => {

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
    const totalPages = Math.ceil(this.tags.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  clickTag(tag: any) {
    this.tag_id = tag;
  }

  click(event: any) {
    // console.log(event);
    // return;
    // this.isModalVisible = true;
    const modalMap: { [key: string]: () => void } = {
      '101': () => setTimeout(() => this.showtags_add = true, 0),
      '102': () => setTimeout(() => this.showtags_add = true, 0),
      // '105': () => setTimeout(() => this.showcategory_add = true, 0),
    };

    const openModal = modalMap[event];
    if (openModal) {
      openModal();
    }
    switch (event) {
      case '101':
        this.newTag = {};
        this.data = {
          action: 'add',
          text: 'Thêm thẻ'
        };
        break;
      case '102':
        this.newTag = this.tags.find(t => t.id == this.tag_id.id);
        this.data = {
          action: 'update',
          text: 'Cập nhật thẻ'
        };
        break;
      default:
        break;
    }
  }
  newData(data: any) {
    const index = this.tags.findIndex(c => c.id === data.id);
    if (index === -1) {
      this.count += 1;
      // this.categories.unshift(data);
      this.tags = [data, ...this.tags];
    } else {
      const updated = [...this.tags];
      updated[index] = data;
      this.tags = updated;
    }
    this.tag_id = data;
  }
  close() {
    this.showtags_add = false;
  }

}
