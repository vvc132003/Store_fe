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
  selector: 'app-polar-area-canvas',
  templateUrl: './polar-area-canvas.component.html',
  styleUrls: ['./polar-area-canvas.component.scss']
})
export class PolarAreaCanvasComponent implements OnChanges, OnInit {

  @ViewChild('polarAreaCanvas', { static: true }) polarAreaCanvas!: ElementRef;
  @Input() reportData: any[] = [];
  chart: Chart | null = null;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportData'] && this.reportData.length) {
      this.renderPolarAreaChart();
    }
  }

  renderPolarAreaChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const labels = this.reportData.map(item => item.drinkName);
    const data = this.reportData.map(item => item.revenuePercentage);
    // console.log(data)
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#00CED1',
      '#FF7F50', '#3CB371', '#FFD700', '#DC143C', '#20B2AA',
      '#F08080', '#778899'
    ];

    new Chart(this.polarAreaCanvas.nativeElement, {
      type: 'polarArea',
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
            position: 'top',
            labels: {
              boxWidth: 20,
              padding: 15,
              generateLabels: (chart) => {
                const original = Chart.overrides.polarArea.plugins.legend.labels.generateLabels(chart);
                return original.map(label => {
                  const maxChars = 15;
                  if (label.text.length > maxChars) {
                    label.text = label.text.slice(0, maxChars) + '...';
                  }
                  return label;
                });
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const chartLabels = context.chart.data.labels;
                const label = chartLabels ? chartLabels[context.dataIndex] : '';
                const value = context.dataset.data[context.dataIndex];
                const numberValue = typeof value === 'number' ? value : 0;
                return `${label}: ${numberValue.toFixed(2)}%`;
              }
            }
          }
        }
      }
    });
  }

}
