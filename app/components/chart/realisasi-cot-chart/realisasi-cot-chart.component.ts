import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-realisasi-cot-chart',
  standalone: true,
  imports: [],
  templateUrl: './realisasi-cot-chart.component.html',
  styleUrl: '../chart.component.css'
})
export class RealisasiCotChartComponent implements AfterViewInit {
  @ViewChild('realisasiCotChart') private realisasiCotChartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | undefined;
  private allDatasetsVisible: boolean = true;

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    const canvas = this.realisasiCotChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
          {
            label: 'Open',
            data: [3, 5, 6, 2, 6, 4, 7, 2, 8, 6, 5, 9],
            backgroundColor: '#3C6735',
            barThickness: 'flex',
          },
          {
            label: 'Cancel',
            data: [4, 2, 9, 3, 7, 7, 5, 8, 2, 9, 6, 4],
            backgroundColor: '#FF0000',
            barThickness: 'flex',
          },
          {
            label: 'Finish',
            data: [3, 2, 6, 4, 7, 8, 6, 3, 8, 5, 7, 9],
            backgroundColor: '#FFB800',
            barThickness: 'flex',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 15,
              boxHeight: 15,
              color: '#FFFFFF',
              font: {
                family: 'Petrona',
                size: 15
              },
            },
            onClick: (_e, legendItem) => {
              const index = legendItem.datasetIndex;
              if (index !== undefined) {
                this.handleLegendClick(index);
              }
            },
            onHover: (e) => {
              const target = e.native?.target as HTMLElement;
              if (target) {
                target.classList.add('legend-hover-pointer');
              }
            },
            onLeave: (e) => {
              const target = e.native?.target as HTMLElement;
              if (target) {
                target.classList.remove('legend-hover-pointer');
              }
            }
          },
          datalabels: {
            color: '#FFF',
            font: {
              family: 'Petrona',
              size: 20
            },
            display: function(context) {
              return context.dataset.data[context.dataIndex] !== 0;
            }
          },
          title: {
            display: true,
            text: 'Realisasi COT 2024',
            color: '#FFFFFF',
            font: {
              family: 'Petrona',
              size: 25
            },
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: '#000',
              font: {
                family: 'Petrona',
                size: 15
              },
            },
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: '#000',
              font: {
                family: 'Petrona',
                size: 15
              },
            },
            grid: {
              color: '#000',
              lineWidth: 2
            }
          }
        }
      }
    });
  }

  private handleLegendClick(index: number) {
    if (!this.chart) return;

    if (this.allDatasetsVisible) {
      // Hide all datasets except the one clicked
      this.chart.data.datasets.forEach((_dataset, i) => {
        const meta = this.chart?.getDatasetMeta(i);
        if (meta) {
          meta.hidden = i !== index;
        }
      });
    } else {
      // Show all datasets
      this.chart.data.datasets.forEach((_dataset, i) => {
        const meta = this.chart?.getDatasetMeta(i);
        if (meta) {
          meta.hidden = false;
        }
      });
    }

    this.allDatasetsVisible = !this.allDatasetsVisible;
    this.chart.update();
  }
}
