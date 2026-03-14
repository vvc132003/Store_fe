import { Component, ElementRef, Input, OnChanges, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-mixed-canvas',
  template: `<canvas #mixedCanvas></canvas>`,
  styleUrls: ['./mixed-canvas.component.scss']
})
export class MixedCanvasComponent implements OnChanges, AfterViewInit {
  @ViewChild('mixedCanvas', { static: true }) mixedCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() revenueData: any[] = [];
  @Input() orderCountData: any[] = [];
  @Input() label: string = "Doanh thu";

  chart: Chart | null = null;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.createChart(); // tạo chart 1 lần sau khi view init
  }

  ngOnChanges(): void {
    this.updateChartData(); // chỉ update dữ liệu khi Input thay đổi
  }

  private createChart() {
    this.ngZone.runOutsideAngular(() => {
      const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

      this.chart = new Chart(this.mixedCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: this.label, data: Array(12).fill(0), backgroundColor: 'rgba(54, 162, 235, 0.6)', yAxisID: 'y', type: 'bar' },
            { label: 'Đơn hàng', data: Array(12).fill(0), borderColor: 'rgba(85, 11, 246, 1)', backgroundColor: 'rgba(85, 11, 246, 1)', tension: 0.3, fill: false, yAxisID: 'y1', type: 'line' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            y: { beginAtZero: true, position: 'left', title: { display: true, text: this.label } },
            y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Đơn hàng' } }
          },
          plugins: { legend: { position: 'top' } }
        }
      });
    });
  }

  private updateChartData() {
    if (!this.chart) return;

    const revenueByMonth = Array(12).fill(0);
    const monthlyData = Array(12).fill(0);

    this.revenueData.forEach(item => revenueByMonth[item.month - 1] = item.totalRevenue);
    this.orderCountData.forEach(item => monthlyData[item.month - 1] = item.orderCount);

    this.ngZone.runOutsideAngular(() => {
      this.chart!.data.datasets[0].data.splice(0, 12, ...revenueByMonth);
      this.chart!.data.datasets[1].data.splice(0, 12, ...monthlyData);
      this.chart!.update('none');
    });
  }
}
