import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardStatsResponse } from '../../../shared/model/dashboard.model';
import { YearNavigationComponent } from '../../year-navigation/year-navigation.component';

@Component({
  selector: 'app-realisasi-cot-chart',
  standalone: true,
  imports: [CommonModule, YearNavigationComponent],
  templateUrl: './realisasi-cot-chart.component.html',
  styleUrl: './realisasi-cot-chart.component.css'
})
export class RealisasiCotChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('realisasiCotChart') private realisasiCotChartRef!: ElementRef<HTMLCanvasElement>;
  @Input() dashboardData: DashboardStatsResponse | null = null;
  @Input() isLoading: boolean = false;
  @Input() selectedYear: number = new Date().getFullYear();
  @Input() availableYears: number[] = [];
  @Output() yearChange = new EventEmitter<number>();
  
  private chart: Chart | undefined;
  private allDatasetsVisible: boolean = true;
  private monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardData'] && this.chart) {
      this.updateChartData();
    }
    if (changes['selectedYear'] && this.chart) {
      this.updateChartData();
    }
  }

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
    
    // Multiple initialization attempts to ensure chart renders
    setTimeout(() => {
      this.initializeChart();
    }, 50);
    
    setTimeout(() => {
      if (!this.chart) {
        console.log('🔄 Retry chart initialization...');
        this.initializeChart();
      }
    }, 200);
    
    setTimeout(() => {
      if (!this.chart) {
        console.log('🔄 Final retry chart initialization...');
        this.initializeChart();
      }
    }, 1000);
  }

  private initializeChart(): void {
    // Destroy existing chart if any
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    
    const canvas = this.realisasiCotChartRef.nativeElement;
    
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    // Ensure canvas is visible and has dimensions
    const container = canvas.parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('Container has no dimensions, retrying...');
        setTimeout(() => this.initializeChart(), 200);
        return;
      }
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
    }
    
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    console.log('🎨 Initializing chart with canvas dimensions:', {
      width: canvas.width,
      height: canvas.height,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight
    });

    const initialData = this.getChartData();
    console.log('📊 Chart data:', initialData);
    
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: initialData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'center',
            labels: {
              boxWidth: 16,
              boxHeight: 16,
              color: '#000000',
              font: {
                family: 'Petrona',
                size: 13,
                weight: 'bold'
              },
              padding: 20,
              usePointStyle: false, // Use square boxes instead of circles
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
            display: false
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
    console.log('🔍 Dashboard Data:', this.dashboardData);
    
    if (!this.dashboardData) {
      console.log('❌ No dashboard data available, showing sample chart');
      // Return sample data when no dashboard data is available for better visualization
      return {
        labels: this.monthLabels,
        datasets: [
          {
            label: 'Akan Datang',
            data: [2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3],
            backgroundColor: '#3C6735',
            barThickness: 'flex',
          },
          {
            label: 'Sedang Berjalan',
            data: [1, 2, 3, 1, 3, 2, 1, 3, 2, 3, 1, 2],
            backgroundColor: '#FFB800',
            barThickness: 'flex',
          },
          {
            label: 'Selesai',
            data: [5, 4, 6, 3, 5, 4, 6, 5, 3, 4, 5, 6],
            backgroundColor: '#e20f0f',
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
          backgroundColor: '#e20f0f',
          barThickness: 'flex',
        }
      ]
    };
  }

  private updateChartData(): void {
    if (!this.chart || !this.dashboardData) return;

    const newData = this.getChartData();

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

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  onYearChange(year: number): void {
    this.yearChange.emit(year);
  }
}
