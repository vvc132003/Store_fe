import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { OrderService } from 'src/app/services/order.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  orderCountData: any[] = [];
  revenueData: any[] = [];
  reportData: any[] = [];
  summary: any = {};
  comments: any[] = [];

  constructor(private titleService: Title, private datePipe: DatePipe, private _comment: CommentService, private _project: ProjectService, private _orders: OrderService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle('Doanh thu');
    // this.loadDrinkRevenueReport();
    // this.loadOrderCount();
    // this.loadRevenueByMonth();
    this.loadMonthlyOrderStats();
    this.loadDashboardSummary();
    this.loadDrinkRevenueReport();
    this.loadComment();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadComment() {
    this.subscription.add(
      this._comment.getData().subscribe((res: any) => {
        this.comments = res;
      })
    );
  }


  /// tính thời gian

  getFormattedTime(dateStr: string | Date): string | null {
    const date = new Date(dateStr);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return null;
    }
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (diffMinutes < 1) {
      return 'Vừa xong';
    } else if (diffMinutes < 60 && isToday) {
      return `${diffMinutes} phút trước`;
    } else if (isToday) {
      return this.datePipe.transform(date, 'HH:mm') ?? 'ngày';
    } else if (isYesterday) {
      return `Hôm qua ${this.datePipe.transform(date, 'HH:mm') ?? ''}`;
    } else if (date.getFullYear() === now.getFullYear()) {
      return this.datePipe.transform(date, 'dd/MM HH:mm') ?? '';
    } else {
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') ?? '';
    }
  }


  // loadOrderCount() {
  //   this._project.getMonthlyOrderCount().subscribe((data: any) => {
  //     this.orderCountData = data;
  //   })
  // }

  // loadRevenueByMonth() {
  //   this._project.monthlyRevenue().subscribe((data: any) => {
  //     this.revenueData = data;
  //   })
  // }
  selectedYear!: number;
  availableYears: number[] = [2023, 2024, 2025, 2026, 2027];
  allOrderData: any[] = [];
  allRevenueData: any[] = [];
  loadMonthlyOrderStats() {
    this.selectedYear = new Date().getFullYear();
    this.subscription.add(

      this._project.getMonthlyOrderStats().subscribe((data: any) => {
        this.allOrderData = data.orderCount;
        this.allRevenueData = data.totalRevenue;
        this.onFilter();
      })
    );
  }

  loadDashboardSummary() {
    this.subscription.add(

      this._orders.getDashboardSummary().subscribe((data: any) => {
        this.summary = data;
      })
    );
  }

  loadDrinkRevenueReport() {
    this._project.generateDrinkRevenueReport().subscribe((data: any) => {
      const top5 = data.slice(0, 5);
      this.reportData = top5;
    })
  }

  fromDate: string = '';
  toDate: string = '';

  onFilter() {


    let filteredOrder = this.allOrderData;
    let filteredRevenue = this.allRevenueData;

    if (this.selectedYear) {
      const year = Number(this.selectedYear);
      filteredOrder = [...this.allOrderData.filter(item => item.year === year)];
      filteredRevenue = [...this.allRevenueData.filter(item => item.year === year)];
    }
    this.orderCountData = [...filteredOrder];
    this.revenueData = [...filteredRevenue];


  }
}