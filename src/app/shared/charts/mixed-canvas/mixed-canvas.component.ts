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
  selector: 'app-mixed-canvas',
  templateUrl: './mixed-canvas.component.html',
  styleUrls: ['./mixed-canvas.component.scss']
})
export class MixedCanvasComponent implements OnChanges, OnInit {
  @ViewChild('mixedCanvas', { static: true }) mixedCanvas!: ElementRef;

  @Input() revenueData: any[] = [];
  @Input() orderCountData: any[] = [];
  @Input() label: string = "Doanh thu";
  chart: Chart | null = null;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['revenueData'] || changes['orderCountData'])

    ) {
      this.renderBar();
    }
  }


  renderBar() {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

    const revenueByMonth = new Array(12).fill(0);
    const monthlyData = new Array(12).fill(0);

    this.revenueData.forEach(item => {
      revenueByMonth[item.month - 1] = item.totalRevenue;
    });

    this.orderCountData.forEach(item => {
      monthlyData[item.month - 1] = item.orderCount;
    });

    this.chart = new Chart(this.mixedCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: this.label, data: revenueByMonth, backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', yAxisID: 'y', type: 'bar' },
          { label: 'Đơn hàng', data: monthlyData, borderColor: 'rgba(85, 11, 246, 1)', backgroundColor: 'rgba(85, 11, 246, 1)', tension: 0.3, fill: false, yAxisID: 'y1', type: 'line' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, position: 'left', title: { display: true, text: this.label } },
          y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Đơn hàng' } }
        },
        plugins: { legend: { position: 'top' } }
      }
    });
  }

}
