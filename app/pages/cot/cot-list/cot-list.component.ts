import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManagementComponent } from "../../../contents/data-management/data-management.component";
import { CotService } from '../../../shared/service/cot.service';
import { Cot } from '../../../shared/model/cot.model';
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-cot-list',
  standalone: true,
  imports: [
    DataManagementComponent,
    HeaderComponent
],
  templateUrl: './cot-list.component.html',
  styleUrl: './cot-list.component.css',
})
export class CotListComponent {
  columns = [
    { header: 'Mulai', field: 'startDate' },
    { header: 'Selesai', field: 'endDate' },
    { header: 'Kode Rating', field: 'ratingCode' },
    { header: 'Nama Training', field: 'trainingName' },
    { header: 'Action', field: 'action' },
  ];

  cot: any[] = [];
  isLoading: boolean = false;

  // Komponen pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  dateFilter: {startDate: string, endDate: string} = {
    startDate: '',
    endDate: '',
  };

  startDate: string = '';
  endDate: string = '';

  dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric' // Pastikan nilai-nilai ini sesuai dengan spesifikasi Intl.DateTimeFormatOptions
  };

  constructor(
    private readonly cotService: CotService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sweetalertService: SweetalertService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['keyword'] || '';
      this.currentPage =+ params['page'] || 1;
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
      this.getListCot(this.searchQuery, this.currentPage, this.itemsPerPage, this.startDate, this.endDate);
    });
  }

  getListCot(searchQuery: string, page: number, size: number, startDate: string, endDate: string): void {
    this.isLoading = true;
    this.cotService.listCot(searchQuery, page, size, startDate, endDate).subscribe({
      next: ({ data, actions, paging }) => {
        this.cot = data.map((cot) => ({
          startDate: new Date(cot.startDate).toLocaleDateString('id-ID', this.dateOptions),
          endDate: new Date(cot.endDate).toLocaleDateString('id-ID', this.dateOptions),
          ratingCode: cot.capability?.ratingCode,
          trainingName: cot.capability?.trainingName,
          editLink: actions?.canEdit ? `/cot/${cot.id}/edit` : null,
          detailLink: actions?.canView ? `/cot/${cot.id}/detail` : null,
          deleteMethod: actions?.canDelete ? () => this.deleteCot(cot) : null,
        }));

        this.totalPages = paging?.totalPage ?? 1;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  async deleteCot(cot: Cot): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm('Anda Yakin?', `Apakah anda ingin menghapus COT ${cot.capability.trainingName}?`, 'warning', 'Ya, hapus!');
    if (isConfirmed) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.cotService.deleteCot(cot.id).subscribe({
        next: () => {
          this.sweetalertService.alert('Dihapus!', 'Data COT berhasil dihapus', 'success');
          this.cot = this.cot.filter(c => c.id !== cot.id);

          if(this.cot.length === 0 && this.currentPage > 0) {
            this.currentPage -= 1;
          }

          this.getListCot(this.searchQuery, this.currentPage, this.itemsPerPage, this.startDate, this.endDate);

          // Cek apakah halaman saat ini lebih besar dari total halaman
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages; // Pindah ke halaman sebelumnya
          }

          // Update query params dengan currentPage yang diperbarui
          const queryParams = this.searchQuery
            ? { keyword: this.searchQuery, page: this.currentPage }
            : { page: this.currentPage };

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge',
          });
        },
        error: (error) => {
          console.log(error);
          this.sweetalertService.alert('Gagal!', 'Terjadi kesalahan, coba lagi nanti', 'error');
        }
      });
    }
  }

  onSearchChanged(query: string): void {
    if (query.trim() === '') {
      this.router.navigate([], {
        queryParams: { keyword: null, page: null },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        queryParams: { keyword: query, page: 1 },
        queryParamsHandling: 'merge',
      });
    }
  }

  viewAll(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { keyword: undefined, startDate: undefined, endDate: undefined, page: undefined },
      queryParamsHandling: 'merge',
    });
    this.searchQuery = '';
  }

  onPageChanged(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
