import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from '../../../shared/service/dashboard.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-total-sertifikat-aktif',
  standalone: true,
  imports: [],
  templateUrl: './data-total-sertifikat-aktif.component.html',
  styleUrl: '../chart.component.css'
})
export class DataTotalSertifikatAktifComponent implements AfterViewInit, OnDestroy {
  @ViewChild('totalSertifikatAktif') private totalSertifikatAktifRef!: ElementRef<HTMLCanvasElement>;
  
  private subscription?: Subscription;
  private chart?: Chart;
  isLoading = true;
  hasError = false;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    // Wait for DOM to be fully rendered with dimensions
    setTimeout(() => {
      this.waitForContainerAndInitialize();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private waitForContainerAndInitialize(attempts: number = 0, maxAttempts: number = 20): void {
    const canvas = this.totalSertifikatAktifRef?.nativeElement;
    const container = canvas?.parentElement;
    
    if (!canvas || !container) {
      if (attempts < maxAttempts) {
        setTimeout(() => this.waitForContainerAndInitialize(attempts + 1, maxAttempts), 100);
      }
      return;
    }
    
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width > 0 && containerRect.height > 0) {
      this.initializeChart();
    } else if (attempts < maxAttempts) {
      setTimeout(() => this.waitForContainerAndInitialize(attempts + 1, maxAttempts), 100);
    }
  }

  private initializeChart(): void {
    const canvas = this.totalSertifikatAktifRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    // Create chart immediately with default data to prevent loading flicker
    this.createChartWithDefaultData(ctx);
    
    // Then load real data and update chart
    this.loadActiveCertificatesData();
  }
  
  private async loadActiveCertificatesData(): Promise<void> {
    try {
      this.isLoading = true;
      this.hasError = false;
      
      const response = await this.dashboardService.getActiveCertificatesByTrainingType().toPromise();
      console.log('🔍 Full API Response:', response);
      
      if (response?.data) {
        const chartData = response.data;
        console.log('📊 Chart Data:', chartData);
        console.log('🏷️ Labels:', chartData.labels);
        console.log('📈 Data Values:', chartData.data);
        console.log('📊 Total Active:', chartData.totalActive);
        
        // Validasi data sebelum update chart
        if (chartData.labels && chartData.data && chartData.labels.length > 0 && chartData.data.length > 0) {
          // Filter data yang memiliki nilai > 0 untuk menghindari tampilan kosong
          const filteredData = chartData.labels.map((label: string, index: number) => ({
            label,
            value: chartData.data[index] || 0
          })).filter((item: any) => item.value > 0);
          
          console.log('🧹 Filtered Data (non-zero):', filteredData);
          
          const filteredLabels = filteredData.map((item: any) => item.label);
          const filteredValues = filteredData.map((item: any) => item.value);
          
          console.log('📝 Final Labels:', filteredLabels);
          console.log('📝 Final Values:', filteredValues);
          
          // Update existing chart with real data
          this.updateChartData(filteredLabels, filteredValues, chartData.totalActive);
        }
      }
    } catch (error) {
      console.error('❌ Error loading active certificates data:', error);
      this.hasError = true;
      this.errorHandler.alertError(error);
    } finally {
      this.isLoading = false;
    }
  }
  
  private updateChartData(labels: string[], dataValues: number[], totalActive: number): void {
    if (!this.chart) return;
    
    // Update chart data
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = dataValues;
    this.chart.data.datasets[0].label = `${totalActive}`;
    
    // Update chart with animation
    this.chart.update('active');
  }
  
  private createChartWithDefaultData(ctx: CanvasRenderingContext2D): void {
    // Menggunakan rating codes yang konsisten dengan data GSE Operator
    const dataValues = [30, 75, 62, 51, 49, 18, 35, 49, 41, 97, 75, 50, 81];
    const labels = ['FLT', 'GPS', 'WSS', 'WMT', 'AWT', 'GSE', 'ACS', 'ATT', 'BTT', 'RDS', 'LSS', 'ASS', 'TBL'];
    const totalSertifikatAktif = dataValues.reduce((acc, curr) => acc + curr, 0);
    this.createChart(ctx, labels, dataValues, totalSertifikatAktif);
  }
  
  private createChart(ctx: CanvasRenderingContext2D, labels: string[], dataValues: number[], totalActive: number): void {

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: '#003D61',
            stack: 'Stack 0',
            barThickness: 'flex',
            label: `${totalActive}`,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 15,
              boxHeight: 15,
              color: '#FFFFFF',
              font: {
                family: 'Petrona',
                size: 20
              },
              usePointStyle: true,
              pointStyle: 'rect',
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
              size: 18
            },
          },
          title: {
            display: true,
            text: 'Total Sertifikat aktif',
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
              lineWidth: 1
            }
          }
        }
      },
    });
  }
}
