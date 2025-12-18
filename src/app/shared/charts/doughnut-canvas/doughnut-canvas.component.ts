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
  selector: 'app-doughnut-canvas',
  templateUrl: './doughnut-canvas.component.html',
  styleUrls: ['./doughnut-canvas.component.scss']
})
export class DoughnutCanvasComponent implements OnInit, OnChanges {

  @ViewChild('doughnutCanvas', { static: true }) doughnutCanvas!: ElementRef;
  chart: Chart | null = null;

  @Input() reportData: any[] = [];

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportData'] && this.reportData.length) {
      this.renderDoughnutChart();
    }
  }

  renderDoughnutChart() {
     if (this.chart) {
      this.chart.destroy();
    }
    const labels = this.reportData.map(item => item.drinkName);
    const data = this.reportData.map(item => item.revenuePercentage);

    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#00CED1',
      '#FF7F50', '#3CB371', '#FFD700', '#DC143C', '#20B2AA'
    ];

    new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    });
  }

}
