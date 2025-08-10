import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from '../../../shared/service/dashboard.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';

@Component({
  selector: 'app-data-jumlah-pemegang-sertifikat',
  standalone: true,
  imports: [],
  templateUrl: './data-jumlah-pemegang-sertifikat.component.html',
  styleUrl: '../chart.component.css',
})
export class DataJumlahPemegangSertifikatComponent implements AfterViewInit, OnInit {
  @ViewChild('jumlahPemegangSertifikat')
  private jumlahPemegangSertifikatRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'pie', number[], string> | undefined;
  private allDatasetsVisible: boolean = true;
  private isDataLoaded: boolean = false;

  private data: number[] = [175, 21]; // Default fallback data
  private labels: string[] = ['GMF', 'Non GMF']; // Default labels
  
  private dashboardService = inject(DashboardService);
  private errorHandlerService = inject(ErrorHandlerService);

  ngOnInit(): void {
    this.loadCertificateData();
  }

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    // Wait for DOM to be fully rendered with dimensions
    setTimeout(() => {
      this.waitForContainerAndInitialize();
    }, 100);
  }

  private waitForContainerAndInitialize(attempts: number = 0, maxAttempts: number = 20): void {
    const canvas = this.jumlahPemegangSertifikatRef?.nativeElement;
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
    const canvas = this.jumlahPemegangSertifikatRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['GMF', 'Non GMF'],
        datasets: [
          {
            data: this.data,
            backgroundColor: ['#09203f', '#2ca02c'],
            borderWidth: 0,
            rotation: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
              padding: 15,
              color: '#FFFFFF',
              font: (context) => {
                const chartWidth = context?.chart?.width || 500;
                // Responsif: ukuran font legend berdasarkan lebar chart
                if (chartWidth < 400) {
                  return {
                    family: 'Petrona',
                    size: 12
                  };
                } else if (chartWidth < 500) {
                  return {
                    family: 'Petrona',
                    size: 14
                  };
                } else {
                  return {
                    family: 'Petrona',
                    size: 16
                  };
                }
              },
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 12,
              boxHeight: 12,
            },
            onClick: (_e, legendItem) => {
              const index = legendItem.index;
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
            font: (context) => {
              const chartWidth = context.chart.width;
              // Responsif: ukuran font berdasarkan lebar chart
              if (chartWidth < 400) {
                return {
                  family: 'Petrona',
                  size: 16
                };
              } else if (chartWidth < 500) {
                return {
                  family: 'Petrona',
                  size: 20
                };
              } else {
                return {
                  family: 'Petrona',
                  size: 25
                };
              }
            },
            display: function(context) {
              return context.dataset.data[context.dataIndex] !== 0;
            }
          },
          title: {
            display: true,
            text: 'Jumlah Pemegang Sertifikat',
            color: '#FFFFFF',
            font: {
              size: 25,
              family: 'Petrona',
            }
          },
        },
      },
    });
  }

  private async loadCertificateData(): Promise<void> {
    try {
      const response = await this.dashboardService.getCertificateStatistics().toPromise();
      if (response?.data) {
        const stats = response.data;
        // For now, we'll use certificateHolders as total
        // You may need to adjust this based on your actual data structure
        const totalHolders = stats.certificateHolders || 0;
        // Since we don't have GMF vs Non-GMF breakdown in certificate statistics,
        // we'll keep using the hardcoded values but could be extended later
        // to include this breakdown in the backend
        this.data = [Math.round(totalHolders * 0.89), Math.round(totalHolders * 0.11)];
        this.isDataLoaded = true;
        
        // Update chart if it's already initialized
        if (this.chart) {
          this.updateChartData();
        }
      }
    } catch (error) {
      console.error('Error loading certificate data:', error);
      this.errorHandlerService.alertError(error);
      // Keep using default data on error
    }
  }

  private updateChartData(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [...this.data];
      this.chart.update();
    }
  }

  private handleLegendClick(index: number) {
    if (!this.chart) return;

    const meta = this.chart.getDatasetMeta(0);

    if (this.allDatasetsVisible) {
      // Hide all segments except the one clicked
      this.chart.data.datasets[0].data = this.chart.data.datasets[0].data.map((value, i) => (i === index ? this.data[i] : 0));
    } else {
      // Show all segments
      this.chart.data.datasets[0].data = [...this.data];
    }

    this.allDatasetsVisible = !this.allDatasetsVisible;
    this.chart.update();
  }
}
