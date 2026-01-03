import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManagementComponent } from "../../../shared/components/data-management/data-management.component";
import { CapabilityService } from '../../../shared/service/capability.service';
import { SweetalertService } from '../../../shared/service/sweetalert.service';
import { Capability } from '../../../shared/model/capability.model';
import { HeaderComponent } from "../../../components/header/header.component";
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';

@Component({
  selector: 'app-capability-list',
  standalone: true,
  imports: [
    DataManagementComponent,
    HeaderComponent
],
  templateUrl: './capability-list.component.html',
})
export class CapabilityListComponent implements OnInit {
  pageTitle: string = "Capability";

  columns = [
    { header: 'Kode Rating', field: 'ratingCode' },
    { header: 'Kode Training', field: 'trainingCode' },
    { header: 'Nama Training', field: 'trainingName' },
    { header: 'Durasi Materi Regulasi GSE', field: 'durasiMateriRegulasiGSE' },
    { header: 'Durasi Materi Kompetensi', field: 'durasiMateriKompetensi' },
    { header: 'Total Durasi', field: 'totalDuration' },
    { header: 'Kurikulum & Silabus', field: 'kurikulumSilabus' },
    { header: 'Action', field: 'action' }
  ];

  capability: any[] = [];
  isLoading: boolean = false;

  // Komponen pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';

  // Komponen Search
  placeHolder: string = 'Cari Capability';

  // State sorting universal
  sortBy: string = 'ratingCode';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private capabilityService: CapabilityService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['keyword'] || '';
      this.currentPage =+ params['page'] || 1;
      this.sortBy = params['sort_by'] || 'ratingCode';
      this.sortOrder = params['sort_order'] || 'asc';
      this.getListCapability(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);
    });
  }

  getListCapability(query: string, page: number, size: number, sortBy: string, sortOrder: string): void {
    this.isLoading = true;
    this.capabilityService.listCapability(query, page, size, sortBy, sortOrder).subscribe({
      next: ({ data, actions, paging }) => {
        this.capability = data.map((capability: any) => {
          return {
            id: capability.id,
            ratingCode: capability.ratingCode,
            trainingCode: capability.trainingCode,
            trainingName: capability.trainingName,
            durasiMateriRegulasiGSE: Number(capability.totalMaterialDurationRegGse) || 0,
            durasiMateriKompetensi: Number(capability.totalMaterialDurationCompetency) || 0,
            totalDuration: (Number(capability.totalMaterialDurationRegGse) || 0) + (Number(capability.totalMaterialDurationCompetency) || 0),
            kurikulumSilabus: `/capability/${capability.id}/curriculum-syllabus`,
            editLink: actions?.canEdit ? `/capability/${capability.id}/edit` : null,
            deleteMethod: actions?.canDelete ? () => this.deleteCapability(capability) : null,
          };
        });
        this.totalPages = paging?.totalPage || 1;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
      complete: () => {
          this.isLoading = false;
      },
    });
  }

  async deleteCapability(capability: Capability): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm('Anda Yakin?', `Apakah anda ingin menghapus capability ini : ${capability.trainingName}?`, 'warning', 'Ya, hapus!');
    if (isConfirmed) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.capabilityService.deleteCapability(capability.id).subscribe({
        next: () => {
          this.sweetalertService.alert('Dihapus!', 'Data capability berhasil dihapus', 'success');
          this.capability = this.capability.filter(c => c.id !== capability.id);

          if(this.capability.length === 0 && this.currentPage > 0) {
            this.currentPage -= 1;
          }

          this.getListCapability(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);

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
          this.errorHandlerService.alertError(error);
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

  onPageChanged(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  viewAll(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { keyword: undefined, page: undefined },
      queryParamsHandling: 'merge',
    });
    this.searchQuery = '';
  }

  toggleSort(col: string) {
    if (this.sortBy === col) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = col;
      this.sortOrder = 'asc';
    }
    this.router.navigate([], {
      queryParams: { sort_by: this.sortBy, sort_order: this.sortOrder, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }) {
    this.toggleSort(event.sortBy);
  }
}
