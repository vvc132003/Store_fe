import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  NgZone,
  SimpleChanges
} from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-mixed-canvas',
  template: `<canvas #mixedCanvas></canvas>`,
  styleUrls: ['./mixed-canvas.component.scss']
})
export class MixedCanvasComponent implements OnChanges, AfterViewInit, OnDestroy {

  @ViewChild('mixedCanvas', { static: true })
  mixedCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() revenueData: any[] = [];
  @Input() orderCountData: any[] = [];
  @Input() label: string = "Doanh thu";

  chart: Chart | null = null;
  viewInitialized = false;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewInitialized) {
      this.updateChartData();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private createChart() {

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

    this.ngZone.runOutsideAngular(() => {

      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              type: 'bar',
              label: this.label,
              data: Array(12).fill(0),
              backgroundColor: 'rgba(54,162,235,0.6)',
              yAxisID: 'y'
            },
            {
              type: 'line',
              label: 'Đơn hàng',
              data: Array(12).fill(0),
              borderColor: 'rgba(85,11,246,1)',
              backgroundColor: 'rgba(85,11,246,1)',
              tension: 0.3,
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              position: 'left',
              title: {
                display: true,
                text: this.label
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              grid: {
                drawOnChartArea: false
              },
              title: {
                display: true,
                text: 'Đơn hàng'
              }
            }
          }
        }
      };

      this.chart = new Chart(this.mixedCanvas.nativeElement, config);
    });

    this.updateChartData();
  }

  private updateChartData() {

    if (!this.chart) return;

    const revenueByMonth = Array(12).fill(0);
    const orderByMonth = Array(12).fill(0);

    this.revenueData?.forEach(item => {
      if (item.month >= 1 && item.month <= 12) {
        revenueByMonth[item.month - 1] = item.totalRevenue;
      }
    });

    this.orderCountData?.forEach(item => {
      if (item.month >= 1 && item.month <= 12) {
        orderByMonth[item.month - 1] = item.orderCount;
      }
    });

    this.ngZone.runOutsideAngular(() => {

      if (!this.chart) return;

      this.chart.data.datasets[0].data = revenueByMonth;
      this.chart.data.datasets[1].data = orderByMonth;

      this.chart.update('none');
    });
  }
}