import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardStatsResponse } from '../../../shared/model/dashboard.model';

@Component({
  selector: 'app-realisasi-cot-chart',
  standalone: true,
  imports: [],
  templateUrl: './realisasi-cot-chart.component.html',
  styleUrl: '../chart.component.css'
})
export class RealisasiCotChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('realisasiCotChart') private realisasiCotChartRef!: ElementRef<HTMLCanvasElement>;
  @Input() dashboardData: DashboardStatsResponse | null = null;
  @Input() isLoading: boolean = false;
  
  private chart: Chart | undefined;
  private allDatasetsVisible: boolean = true;
  private monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardData'] && this.chart && this.dashboardData) {
      this.updateChartData();
    }
  }

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
    this.initializeChart();
  }

  private initializeChart(): void {
    const canvas = this.realisasiCotChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const initialData = this.getChartData();
    
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: initialData,
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
            text: `Realisasi COT ${this.dashboardData?.year || new Date().getFullYear()}`,
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

  private getChartData(): any {
    if (!this.dashboardData) {
      // Return default/empty data when no dashboard data is available
      return {
        labels: this.monthLabels,
        datasets: [
          {
            label: 'Akan Datang',
            data: new Array(12).fill(0),
            backgroundColor: '#3C6735',
            barThickness: 'flex',
          },
          {
            label: 'Sedang Berjalan',
            data: new Array(12).fill(0),
            backgroundColor: '#FFB800',
            barThickness: 'flex',
          },
          {
            label: 'Selesai',
            data: new Array(12).fill(0),
            backgroundColor: '#FF6B6B',
            barThickness: 'flex',
          }
        ]
      };
    }

    // Convert dashboard data to chart format
    const akanDatangData = new Array(12).fill(0);
    const sedangBerjalanData = new Array(12).fill(0);
    const selesaiData = new Array(12).fill(0);

    this.dashboardData.monthlyStats.forEach(monthStat => {
      const monthIndex = monthStat.month - 1; // Convert to 0-based index
      if (monthIndex >= 0 && monthIndex < 12) {
        akanDatangData[monthIndex] = monthStat.akanDatang;
        sedangBerjalanData[monthIndex] = monthStat.sedangBerjalan;
        selesaiData[monthIndex] = monthStat.selesai;
      }
    });

    return {
      labels: this.monthLabels,
      datasets: [
        {
          label: 'Akan Datang',
          data: akanDatangData,
          backgroundColor: '#3C6735',
          barThickness: 'flex',
        },
        {
          label: 'Sedang Berjalan',
          data: sedangBerjalanData,
          backgroundColor: '#FFB800',
          barThickness: 'flex',
        },
        {
          label: 'Selesai',
          data: selesaiData,
          backgroundColor: '#FF6B6B',
          barThickness: 'flex',
        }
      ]
    };
  }

  private updateChartData(): void {
    if (!this.chart || !this.dashboardData) return;

    const newData = this.getChartData();
    
    // Update chart title with year
    const titlePlugin = this.chart.options.plugins?.title;
    if (titlePlugin) {
      titlePlugin.text = `Realisasi COT ${this.dashboardData.year}`;
    }

    // Update datasets
    this.chart.data.datasets.forEach((dataset, index) => {
      if (newData.datasets[index]) {
        dataset.data = newData.datasets[index].data;
        dataset.label = newData.datasets[index].label;
      }
    });

    // Trigger chart update with animation
    this.chart.update('active');
  }
}
