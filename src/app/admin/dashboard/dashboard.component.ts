import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OrderService } from 'src/app/services/order.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  orderCountData: any[] = [];
  revenueData: any[] = [];
  reportData: any[] = [];
  summary: any = {};

  constructor(private titleService: Title, private _project: ProjectService, private _orders: OrderService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Doanh thu');
    // this.loadDrinkRevenueReport();
    // this.loadOrderCount();
    // this.loadRevenueByMonth();
    this.loadMonthlyOrderStats();
    this.loadDashboardSummary();

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

    this._project.getMonthlyOrderStats().subscribe((data: any) => {
      this.allOrderData = data.orderCount;
      this.allRevenueData = data.totalRevenue;
      this.onFilter();
    })
  }

  loadDashboardSummary() {
    this._orders.getDashboardSummary().subscribe((data: any) => {
      this.summary = data;
    })
  }

  // loadDrinkRevenueReport() {
  //   this._project.generateDrinkRevenueReport().subscribe((data: any) => {
  //     const top5 = data.slice(0, 5);
  //     this.reportData = top5;
  //   })
  // }

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