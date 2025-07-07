import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RealisasiCotChartComponent } from '../../../../components/chart/realisasi-cot-chart/realisasi-cot-chart.component';
import { DataPemegangKompetensiGseOperatorComponent } from '../../../../components/chart/data-pemegang-kompetensi-gse-operator/data-pemegang-kompetensi-gse-operator.component';
import { DataTotalSertifikatAktifComponent } from '../../../../components/chart/data-total-sertifikat-aktif/data-total-sertifikat-aktif.component';
import { DataJumlahPemegangSertifikatComponent } from '../../../../components/chart/data-jumlah-pemegang-sertifikat/data-jumlah-pemegang-sertifikat.component';
import { TableComponent } from '../../../../components/table/table.component';
import { HeaderComponent } from '../../../../components/header/header.component';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { CotService } from '../../../../shared/service/cot.service';
import { CotResponse } from '../../../../shared/model/cot.model';
import { WebResponse } from '../../../../shared/model/web.model';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';

interface DashboardCotItem {
  trainingName: string;
  ratingCode: string;
  startDate: string;
  endDate: string;
  numberOfParticipants: number;
  trainingLocation: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RealisasiCotChartComponent,
    DataPemegangKompetensiGseOperatorComponent,
    DataTotalSertifikatAktifComponent,
    DataJumlahPemegangSertifikatComponent,
    TableComponent,
    HeaderComponent,
    PaginationComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private readonly cotService: CotService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  isLoading: boolean = false;
  dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  columns = [
    { header: 'Nama Training', field: 'trainingName' },
    { header: 'Mulai', field: 'startDate' },
    { header: 'Selesai', field: 'endDate' },
    { header: 'Kode Rating', field: 'ratingCode' },
    { header: 'Jumlah Peserta', field: 'numberOfParticipants' },
    { header: 'Lokasi Training', field: 'trainingLocation' },
  ];

  cot: DashboardCotItem[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages: number = 0;
  private refreshSubject = new Subject<void>();

  ngOnInit(): void {
    this.refreshSubject.pipe(debounceTime(300)).subscribe(() => this.fetchData());
    this.refreshData();
  }

  refreshData(): void {
    this.isLoading = true;
    this.refreshSubject.next();
  }

  private async fetchData(): Promise<void> {
    try {
      const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
      const response = await this.cotService
        .listCot('', this.currentPage, this.itemsPerPage, '', '', { headers })
        .toPromise();

      const { data, paging } = response as WebResponse<CotResponse[]>;
      this.cot = data.map((cot: CotResponse) => ({
        trainingName: cot.capability?.trainingName ?? 'N/A',
        ratingCode: cot.capability?.ratingCode ?? 'N/A',
        startDate: new Date(cot.startDate).toLocaleDateString('id-ID', this.dateOptions),
        endDate: new Date(cot.endDate).toLocaleDateString('id-ID', this.dateOptions),
        numberOfParticipants: cot.numberOfParticipants ?? 0,
        trainingLocation: cot.trainingLocation ?? 'N/A',
      }));
      this.totalPages = paging?.totalPage ?? 1;
    } catch (error) {
      console.error('Error fetching COT data:', error);
      this.errorHandler.alertError(error);
    } finally {
      this.isLoading = false;
    }
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.refreshData();
  }
}
