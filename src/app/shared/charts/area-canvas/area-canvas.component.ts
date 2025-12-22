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
  selector: 'app-area-canvas',
  templateUrl: './area-canvas.component.html',
  styleUrls: ['./area-canvas.component.scss']
})
export class AreaCanvasComponent implements OnChanges, OnInit {
  @ViewChild('areaCanvas', { static: true }) areaCanvas!: ElementRef;
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
      this.renderAreaChart();
    }
  }
  renderAreaChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const monthlyRevenue: number[] = Array(12).fill(0);

    this.revenueData.forEach(item => {
      const monthIndex = item.month - 1;
      monthlyRevenue[monthIndex] = Math.round(item.totalRevenue / 1_000_000);
    });

    const labels = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    new Chart(this.areaCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Tổng doanh thu (triệu VNĐ)',
          data: monthlyRevenue,
          fill: true,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          pointBackgroundColor: '#fff'
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Tháng ${context.dataIndex + 1}: ${context.raw} triệu`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Triệu VNĐ'
            }
          }
        }
      }
    });
  }
}

