import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { RealisasiCotChartComponent } from '../../../../components/chart/realisasi-cot-chart/realisasi-cot-chart.component';
import { DataPemegangKompetensiGseOperatorComponent } from '../../../../components/chart/data-pemegang-kompetensi-gse-operator/data-pemegang-kompetensi-gse-operator.component';
import { DataTotalSertifikatAktifComponent } from '../../../../components/chart/data-total-sertifikat-aktif/data-total-sertifikat-aktif.component';
import { DataJumlahPemegangSertifikatComponent } from '../../../../components/chart/data-jumlah-pemegang-sertifikat/data-jumlah-pemegang-sertifikat.component';
import { TableComponent } from '../../../../components/table/table.component';
import { HeaderComponent } from '../../../../components/header/header.component';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { CotService } from '../../../../shared/service/cot.service';
import { DashboardService } from '../../../../shared/service/dashboard.service';
import { CotResponse } from '../../../../shared/model/cot.model';
import { DashboardStatsResponse } from '../../../../shared/model/dashboard.model';
import { WebResponse } from '../../../../shared/model/web.model';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';

interface DashboardCotItem {
  trainingName: string;
  ratingCode: string;
  capabilityLink: string | null;
  state: { previousUrl: string };
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
    private readonly dashboardService: DashboardService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  // Dashboard Statistics Properties
  dashboardData: DashboardStatsResponse | null = null;
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  isLoadingDashboard: boolean = false;
  
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

  // ✅ Sorting state universal
  sortBy: string = 'startDate';
  sortOrder: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.initAvailableYears();
    this.refreshSubject.pipe(debounceTime(300)).subscribe(() => this.fetchData());
    this.fetchDashboardData(); // Fetch dashboard data on init
    this.refreshData();
  }

  private initAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.availableYears.push(year);
    }
  }

  onYearSelected(year: number): void {
    this.selectedYear = year;
    this.fetchDashboardData();
  }

  private async fetchDashboardData(): Promise<void> {
    try {
      this.isLoadingDashboard = true;
      const response = await this.dashboardService.getDashboardStats(this.selectedYear).toPromise();
      this.dashboardData = response?.data || null;
      
      // Update available years if data contains them
      if (this.dashboardData?.availableYears?.length) {
        this.availableYears = this.dashboardData.availableYears;
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      this.errorHandler.alertError(error);
    } finally {
      this.isLoadingDashboard = false;
    }
  }

  refreshData(): void {
    this.isLoading = true;
    this.refreshSubject.next();
  }

  private async fetchData(): Promise<void> {
    try {
      const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
      
      // ✅ Debug logging untuk sorting
      console.log('🔍 Dashboard Sorting Debug:', {
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage
      });
      
      const response = await this.cotService
        .listCot('', this.currentPage, this.itemsPerPage, '', '', this.sortBy, this.sortOrder, { headers })
        .toPromise();

      const { data, paging } = response as WebResponse<CotResponse[]>;
      this.cot = data.map((cot: CotResponse) => ({
        trainingName: cot.capability?.trainingName ?? 'N/A',
        ratingCode: cot.capability?.ratingCode ?? 'N/A',
        capabilityLink: cot.capability?.id ? `/capability/${cot.capability.id}/curriculum-syllabus` : null,
        state: { previousUrl: '/dashboard' },
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

  // ✅ Sorting handler konsisten dengan halaman lain
  onSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }): void {
    this.sortBy = event.sortBy;
    this.sortOrder = event.sortOrder;
    this.currentPage = 1; // Reset to first page when sorting changes
    this.refreshData();
  }
}
