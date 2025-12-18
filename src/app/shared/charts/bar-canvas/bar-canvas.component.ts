import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  Chart,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  PieController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  PieController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
);
@Component({
  selector: 'app-bar-canvas',
  templateUrl: './bar-canvas.component.html',
  styleUrls: ['./bar-canvas.component.scss']
})
export class BarCanvasComponent implements OnInit, OnChanges {
  @ViewChild('barCanvas', { static: true }) barCanvas!: ElementRef;
  @Input() revenueData: any[] = [];
  chart: Chart | null = null;

  ngOnInit(): void {
    // this.loadRevenueByMonth();
  }
  // loadRevenueByMonth() {
  //   this.drinkService.monthlyRevenue().subscribe((data: any) => {
  //     this.revenueData = data;
  //     this.rendermonthlyRevenue();
  //   })
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['revenueData'] && this.revenueData.length) {
      this.rendermonthlyRevenue();
    }
  }
  rendermonthlyRevenue() {
     if (this.chart) {
      this.chart.destroy();
    }
    const revenueByMonth = new Array(12).fill(0);
    this.revenueData.forEach(item => {
      revenueByMonth[item.month - 1] = item.totalRevenue;
    });

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [{
          label: 'Doanh thu',
          data: revenueByMonth,
          backgroundColor: [
            // 'rgba(255, 99, 132, 0.7)',
            // 'rgba(54, 162, 235, 0.7)',
            // 'rgba(255, 206, 86, 0.7)',
            // 'rgba(75, 192, 192, 0.7)',
            // 'rgba(153, 102, 255, 0.7)',
            // 'rgba(255, 159, 64, 0.7)',
            // 'rgba(201, 203, 207, 0.7)',
            // 'rgba(255, 99, 132, 0.7)',
            // 'rgba(54, 162, 235, 0.7)',
            // 'rgba(255, 206, 86, 0.7)',
            // 'rgba(75, 192, 192, 0.7)',
            // 'rgba(153, 102, 255, 0.7)'
            'rgba(54, 162, 235, 0.7)',

          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
            // 'rgba(201, 203, 207, 1)',
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)'
            'rgba(54, 162, 235, 0.7)',

          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
