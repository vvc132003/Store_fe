import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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


  constructor(private titleService: Title, private _project: ProjectService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Doanh thu');
    this.loadDrinkRevenueReport();
    this.loadOrderCount();
    this.loadRevenueByMonth();

  }

  loadOrderCount() {
    this._project.getMonthlyOrderCount().subscribe((data: any) => {
      this.orderCountData = data;
    })
  }
  loadRevenueByMonth() {
    this._project.monthlyRevenue().subscribe((data: any) => {
      this.revenueData = data;
    })
  }

  loadDrinkRevenueReport() {
    this._project.generateDrinkRevenueReport().subscribe((data: any) => {
      const top5 = data.slice(0, 5);
      this.reportData = top5;
    })
  }
}
