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
import { ProjectService } from 'src/app/services/project.service';

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
  selector: 'app-line-canvas',
  templateUrl: './line-canvas.component.html',
  styleUrls: ['./line-canvas.component.scss']
})
export class LineCanvasComponent implements OnInit, OnChanges {
  @ViewChild('lineCanvas', { static: true }) lineCanvas!: ElementRef;
  @Input() orderCountData: any[] = [];
  chart: Chart | null = null;

  constructor(private _project: ProjectService) { }
  ngOnInit(): void {
    // this.renderOrderCount();
  }

  // loadOrderCount() {
  //   this.drinkService.getMonthlyOrderCount().subscribe((data: any) => {
  //     this.orderCountData = data;
  //     this.renderOrderCount();
  //   })
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderCountData'] && this.orderCountData.length) {
      // this.orderCountData = this.orderCountData;
      this.renderOrderCount();
    }
  }
  renderOrderCount() {
    if (this.chart) {
      this.chart.destroy();
    }
    const monthlyData = new Array(12).fill(0);
    this.orderCountData.forEach(item => {
      monthlyData[item.month - 1] = item.orderCount;
    });

    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [{
          label: 'Đơn hàng',
          data: monthlyData,
          fill: false,
          borderColor: 'rgba(85, 11, 246, 1)',
          tension: 0.3
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

