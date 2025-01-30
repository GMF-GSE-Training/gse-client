import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-data-total-sertifikat-aktif',
  standalone: true,
  imports: [],
  templateUrl: './data-total-sertifikat-aktif.component.html',
  styleUrl: '../chart.component.css'
})
export class DataTotalSertifikatAktifComponent implements AfterViewInit {
  @ViewChild('totalSertifikatAktif') private totalSertifikatAktifRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    const canvas = this.totalSertifikatAktifRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const dataValues = [30, 75, 62, 51, 49, 18, 35, 49, 41, 97, 75, 50, 81];
    const totalSertifikatAktif = dataValues.reduce((acc, curr) => acc + curr, 0);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['FLT', 'GPS', 'WSS', 'WMT', 'AWT', 'GSE', 'ACS', 'ATT', 'BTT', 'RDS', 'LSS', 'ASS', 'TBL'],
        datasets: [
          {
            data: dataValues,
            backgroundColor: '#003D61',
            stack: 'Stack 0',
            barThickness: 'flex',
            label: `${totalSertifikatAktif}`,
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
              pointStyle: 'circle',
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
              lineWidth: 2
            }
          }
        }
      },
    });
  }
}
