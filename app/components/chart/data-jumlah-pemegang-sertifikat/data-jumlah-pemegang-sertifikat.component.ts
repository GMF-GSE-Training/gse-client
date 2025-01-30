import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-data-jumlah-pemegang-sertifikat',
  standalone: true,
  imports: [],
  templateUrl: './data-jumlah-pemegang-sertifikat.component.html',
  styleUrl: '../chart.component.css',
})
export class DataJumlahPemegangSertifikatComponent implements AfterViewInit {
  @ViewChild('jumlahPemegangSertifikat')
  private jumlahPemegangSertifikatRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'pie', number[], string> | undefined;
  private allDatasetsVisible: boolean = true;

  private data: number[] = [175, 21]; // Simpan data asli

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

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
            position: 'bottom',
            labels: {
              padding: 30,
              color: 'black',
              font: {
                size: 20,
                family: 'Petrona',
              },
              usePointStyle: true,
              pointStyle: 'circle',
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
            font: {
              family: 'Petrona',
              size: 25
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
            },
          },
        },
      },
    });
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
