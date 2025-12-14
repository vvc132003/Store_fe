import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-category-source-code',
  templateUrl: './category-source-code.component.html',
  styleUrls: ['./category-source-code.component.scss']
})
export class CategorySourceCodeComponent implements OnInit, OnDestroy {


  project_latest: any[] = [];
  project_by_categoryslug: any[] = [];

  //// phân trang
  totalPages = 1;
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 3;
  pagedData: any[] = [];


  constructor(private _project: ProjectService, private titleService: Title, private route: ActivatedRoute) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadProject_latest();
    this.titleService.setTitle("Danh mục mã nguồn");
    this.route.queryParamMap.subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.loadSourceCodeByCategory(category);
      }
    });
  }

  loadProject_latest() {
    this.subscription.add(
      this._project.getProject_latest().subscribe((data: any) => {
        this.project_latest = data;
        // console.log(data);
      })
    )
  }

  categoryname: string = "";
  count: number = 0;
  loadSourceCodeByCategory(category: string) {
    this.subscription.add(
      this._project.getProjectByCategorySlug(category).subscribe((data: any) => {
        this.project_by_categoryslug = data;
        this.filteredData = [...this.project_by_categoryslug];
        this.currentPage = 1;
        this.categoryname = data[0].categoryName;
        this.count = data.length;
        this.updatePagedData();
        // console.log(data)
      })
    )
  }

  goToPage(page: number) {
    if (page < 1) return;
    const totalPages = Math.ceil(this.project_by_categoryslug.length / this.pageSize);
    if (page > totalPages) return;

    this.currentPage = page;
    this.updatePagedData();
  }

  updatePagedData() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }


  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 3;
    const pages: (number | string)[] = [];

    if (total <= maxVisible) {
      // tổng trang nhỏ hơn maxVisible -> hiện tất cả
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      let start = Math.max(current - 1, 1);
      let end = start + maxVisible - 1;

      if (end > total) {
        end = total;
        start = total - maxVisible + 1;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('…');
      }

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < total) {
        if (end < total - 1) pages.push('…');
        pages.push(total);
      }
    }

    return pages;
  }
  // helper kiểm tra number
  isNumber(value: any): value is number {
    return typeof value === 'number';
  }

  // ===== SORT =====

  // Mới nhất (theo ngày tạo)
  sortNewest() {
    this.filteredData.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    this.resetPaging();
  }

  // Tải nhiều
  sortMostDownload() {
    this.filteredData.sort((a, b) => b.downloadCount - a.downloadCount);
    this.resetPaging();
  }

  // Tên A → Z
  sortNameAsc() {
    this.filteredData.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    this.resetPaging();
  }

  // Tên Z → A
  sortNameDesc() {
    this.filteredData.sort((a, b) =>
      b.title.localeCompare(a.title)
    );
    this.resetPaging();
  }

  // Lượt xem tăng dần
  sortViewAsc() {
    this.filteredData.sort((a, b) => a.viewCount - b.viewCount);
    this.resetPaging();
  }

  // Lượt xem giảm dần
  sortViewDesc() {
    this.filteredData.sort((a, b) => b.viewCount - a.viewCount);
    this.resetPaging();
  }

  // Giá thấp → cao
  sortPriceAsc() {
    this.filteredData.sort((a, b) => a.price - b.price);
    this.resetPaging();
  }

  // Giá cao → thấp
  sortPriceDesc() {
    this.filteredData.sort((a, b) => b.price - a.price);
    this.resetPaging();
  }

  // Reset phân trang
  resetPaging() {
    this.currentPage = 1;
    this.updatePagedData();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
