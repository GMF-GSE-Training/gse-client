import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { KompetensiGseOperatorResponse, KompetensiGseOperatorDataset } from 'src/app/shared/model/dashboard.model';
import { WebResponse } from 'src/app/shared/model/web.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-pemegang-kompetensi-gse-operator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-pemegang-kompetensi-gse-operator.component.html',
  styleUrl: '../chart.component.css',
})
export class DataPemegangKompetensiGseOperatorComponent implements OnInit, AfterViewInit {
  @ViewChild('dataPemegangKompetensiGSEOperator') private dataPemegangKompetensiGseOperatorRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  private allDatasetsVisible: boolean = true;
  chartWidht: number = 0;
  
  // Pemetaan warna konsisten untuk setiap dinas (sesuai dengan data dummy)
  private dinasColors: { [key: string]: string } = {
    'TB': '#000',
    'TC': '#6EACDA',
    'TF': '#03346E',
    'TJ': '#114B5F',
    'TL': '#A66CC1',
    'TM': '#C63C51',
    'TR': 'green',
    'TU': 'blue',
    'TV': 'orange',
    'TZ': 'purple',
    'TA': '#36A2EB',
    // Tambahkan warna untuk dinas lainnya jika diperlukan
  };
  private defaultColor = '#6C757D'; // Warna abu-abu untuk dinas yang tidak terdefinisi

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
  }

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.dashboardService.getKompetensiGseOperatorData().subscribe({
      next: (response: WebResponse<KompetensiGseOperatorResponse>) => {
        if (response.data) {
          console.log('Data loaded from API:', response.data);
          this.createChart(response.data);
        } else {
          console.warn('No data received from API, using dummy data');
          this.createChartWithDummyData();
        }
      },
      error: (error) => {
        console.error('Error loading data from API, using dummy data:', error);
        this.createChartWithDummyData();
      }
    });
  }

  private createChartWithDummyData(): void {
    const dummyData: KompetensiGseOperatorResponse = {
      labels: ['FLT', 'GPS', 'WSS', 'WMT', 'AWT', 'GSE', 'ACS', 'ATT', 'BTT', 'RDS', 'LSS', 'ASS', 'TBL'],
      datasets: [
        { label: 'TA', data: [15, 18, 25, 30, 22, 18, 12, 35, 28, 14, 32, 16, 24] },
        { label: 'TB', data: [19, 23, 55, 35, 34, 12, 11, 45, 26, 12, 44, 12, 34] },
        { label: 'TC', data: [20, 32, 23, 23, 45, 56, 23, 21, 45, 23, 21, 34, 42] },
        { label: 'TF', data: [55, 35, 34, 12, 11, 45, 20, 32, 23, 23, 45, 56, 23] },
        { label: 'TJ', data: [12, 11, 45, 20, 32, 23, 23, 21, 45, 23, 21, 34, 23] },
        { label: 'TL', data: [32, 23, 23, 20, 32, 23, 23, 21, 45, 21, 45, 23, 11] },
        { label: 'TM', data: [45, 21, 45, 23, 11, 32, 46, 13, 12, 23, 43, 54, 75] },
        { label: 'TR', data: [46, 13, 12, 23, 43, 54, 75, 11, 45, 20, 32, 44, 32] },
        { label: 'TU', data: [41, 17, 23, 24, 58, 23, 19, 55, 43, 76, 57, 29, 30] },
        { label: 'TV', data: [28, 22, 31, 45, 38, 27, 18, 33, 64, 19, 42, 35, 52] },
        { label: 'TZ', data: [19, 42, 32, 23, 10, 29, 72, 58, 23, 19, 55, 43, 76] },
      ]
    };
    this.createChart(dummyData);
  }

  private createChart(data: KompetensiGseOperatorResponse): void {
    console.log('🎯 Creating chart with data:', data);
    console.log('🎯 Available datasets:', data.datasets.map(d => d.label));
    console.log('🎯 Dataset count:', data.datasets.length);
    
    const canvas = this.dataPemegangKompetensiGseOperatorRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset: KompetensiGseOperatorDataset) => ({
          ...dataset,
          backgroundColor: this.dinasColors[dataset.label] || this.defaultColor,
          stack: 'Stack 0',
          barThickness: 'flex'
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
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
              size: 15
            },
            display: (context) => {
              return context.dataset.data[context.dataIndex] !== 0;
            }
          },
          title: {
            display: true,
            align: 'center',
            text: 'Data Pemegang Kompetensi GSE Operator',
            color: '#FFFFFF',
            font: {
              family: 'Petrona',
              size: 20
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
      }
    });
  }

  private handleLegendClick(index: number) {
    if (this.allDatasetsVisible) {
      // Sembunyikan semua dataset kecuali yang diklik
      this.chart.data.datasets.forEach((_dataset, i) => {
        const meta = this.chart?.getDatasetMeta(i);
        if (meta) {
          meta.hidden = i !== index;
        }
      });
    } else {
      // Tampilkan semua dataset
      this.chart.data.datasets.forEach((_dataset, i) => {
        const meta = this.chart?.getDatasetMeta(i);
        if (meta) {
          meta.hidden = false;
        }
      });
    }

    this.allDatasetsVisible = !this.allDatasetsVisible;

    // Update ukuran font datalabels berdasarkan jumlah dataset yang terlihat
    const visibleDatasets = this.chart.data.datasets.filter((_, i) => {
      const meta = this.chart?.getDatasetMeta(i);
      return meta && !meta.hidden;
    }).length;

    // Memastikan plugin datalabels ada
    if (this.chart.options.plugins?.datalabels) {
      // Perbarui ukuran font datalabels
      this.chart.options.plugins.datalabels.font = (context) => {
        const widht = context.chart.width;
        if(widht < 500) {
          return {
            family: 'Petrona',
            size: visibleDatasets === 1 ? 10 : 8
          };
        }

        return {
          family: 'Petrona',
          size: visibleDatasets === 1 ? 20 : 13
        }
      };
    }

    this.chart.update();
  }
}
