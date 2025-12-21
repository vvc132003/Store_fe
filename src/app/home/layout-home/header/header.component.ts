import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {



  slides = [
    "https://giaodichcode.com/assets/images/bannerv2/POP-UP-CODE_LARGE-2.jpg",
    "https://giaodichcode.com/assets/images/banner/banner2.png"
  ];

  @Input() category_list: any[] = [];
  project_list: any[] = [];

  currentIndex = 0;
  prevIndex = 0;
  intervalId: any;

  //// phân trang
  totalPages = 1;
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 10;
  pagedData: any[] = [];

  constructor(private _category: CategoryService, private _notification: NotificationService, private cookieService: CookieService, private _project: ProjectService, private _favorite: FavoriteService) {

  }
  private subscription = new Subscription();


  ngOnInit() {
    this.startAutoSlide();
    this.loadProject_list();
  }

  loadProject_list() {
    const token = this.cookieService.get('access_token');
    const payload = this.parseJwt(token);
    // console.log(payload);
    this.subscription.add(
      this._project.getProject_list(payload?.nameid).subscribe((data: any) => {
        this.project_list = data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 11);
        this.filteredData = [...this.project_list];
        this.currentPage = 1;
        this.updatePagedData();
      })
    )

  }


  //#region  event

  goToPage(page: number) {
    if (page < 1) return;
    const totalPages = Math.ceil(this.project_list.length / this.pageSize);
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



  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.subscription.unsubscribe();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide() {
    this.prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.prevIndex = this.currentIndex;
    this.currentIndex = index;
  }

  private parseJwt(token: string): any {
    if (!token) return null;
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

  bookmark(projectId: string): void {
    const token = this.cookieService.get('access_token');
    if (token) {
      const payload = this.parseJwt(token);
      const datapost = {
        userId: payload.nameid,
        projectId: projectId
      }
      this.subscription.add(
        this._favorite.postData(datapost).subscribe((data: any) => {
          if (data) {
            const isFavorite = this.pagedData.find(f => f.id === projectId);
            isFavorite.isFavorite = true;
            this._notification.showSuccess("1006");
          } else {
            this._notification.showWarning("1007");
          }
        })
      )
    }


  }

}