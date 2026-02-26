import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { FavoriteService } from 'src/app/services/favorite.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-featuredgame',
  templateUrl: './featuredgame.component.html',
  styleUrls: ['./featuredgame.component.scss']
})
export class FeaturedgameComponent implements OnChanges, OnDestroy {

  @Input() project_list: any[] = [];
  @Input() avatar: string = "";

  currentIndex = 0;
  prevIndex = 0;
  intervalId: any;
  totalPages = 1;

  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 10;
  pagedData: any[] = [];

  constructor(private cookieService: CookieService, private _favorite: FavoriteService, private _notification: NotificationService) { }
  private subscription = new Subscription();

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project_list'] && this.project_list?.length) {
      // Lọc ra những project typeName = 'Website'
      const filtered = this.project_list.filter(
        project => project.typeName === 'Game'
      );

      // Lấy 5 phần tử đầu
      this.filteredData = filtered.slice(0, 5);

      // Reset phân trang
      this.currentPage = 1;
      this.updatePagedData();
    }
  }


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

  // private parseJwt(token: string): any {
  //   if (!token) return null;
  //   const payload = token.split('.')[1];
  //   const decoded = atob(payload);
  //   const utf8 = decodeURIComponent(
  //     decoded
  //       .split('')
  //       .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //       .join('')
  //   );
  //   return JSON.parse(utf8);
  // }

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

  // bookmark(projectId: string): void {
  //   const token = this.cookieService.get('access_token');
  //   if (token) {
  //     const payload = this.parseJwt(token);
  //     const datapost = {
  //       userId: payload.nameid,
  //       projectId: projectId
  //     }
  //     this.subscription.add(
  //       this._favorite.postData(datapost).subscribe((data: any) => {
  //         if (data) {
  //           const isFavorite = this.pagedData.find(f => f.id === projectId);
  //           isFavorite.isFavorite = true;
  //           this._notification.showSuccess("1006");
  //         } else {
  //           this._notification.showWarning("1007");
  //         }
  //       })
  //     )
  //   }

  // }
  showWarning: boolean = false;
  bookmark(projectId: string): void {
    const datapost = {
      projectId: projectId
    }
    this.subscription.add(
      this._favorite.postData(datapost).subscribe({
        next: () => {
          const isFavorite = this.pagedData.find(f => f.id === projectId);
          isFavorite.isFavorite = true;
          this._notification.showSuccess("1006");
        },
        error: err => {
          if (err.status === 401) {
            this.showWarning = true;
          } else {
            this._notification.showWarning("1007");
          }
        }
      })
    );
  }
}