import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManagementComponent } from "../../../../shared/components/data-management/data-management.component";
import { ESign } from '../../../../shared/model/e-sign.model';
import { ESignService } from '../../../../shared/service/e-sign.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { HeaderComponent } from "../../../../components/header/header.component";

@Component({
  selector: 'app-sign-list',
  standalone: true,
  imports: [
    DataManagementComponent,
    HeaderComponent
],
  templateUrl: './signature-list.component.html',
})
export class SignatureListComponent {
  constructor(
    private eSignService: ESignService,
    private sweetalertService: SweetalertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  columns = [
    { header: 'No Pegawai', field: 'idNumber' },
    { header: 'Role', field: 'role' },
    { header: 'Nama', field: 'name' },
    { header: 'Tipe Tanda Tangan', field: 'signatureType' },
    { header: 'Status', field: 'status' },
    { header: 'Tanda Tangan', field: 'eSign', sortable: false },
    { header: 'Action', field: 'action' }
  ];

  eSign: ESign[] = [];
  isLoading: boolean = false;

  // Komponen pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  isLoadingPagination: boolean = false;

  // State sorting universal
  sortBy: string = 'idNumber';
  sortOrder: 'asc' | 'desc' = 'asc';

  eSignId = this.route.snapshot.paramMap.get('id');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['keyword'] || '';
      this.currentPage =+ params['page'] || 1;
      this.sortBy = params['sort_by'] || 'idNumber';
      this.sortOrder = params['sort_order'] || 'asc';
      this.getListESign(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);
    });
  }

  getListESign(query: string, page: number, size: number, sortBy: string, sortOrder: string): void {
    this.isLoading = true;
    this.isLoadingPagination = true;
    this.eSignService.listESign(query, page, size, sortBy, sortOrder).subscribe({
      next: ({ data, actions, paging }) => {
        this.eSign = data.map((eSign: any) => ({
          ...eSign,
          signatureType: eSign.signatureType
            .replace('SIGNATURE1', 'Tanda tangan 1')
            .replace('SIGNATURE2', 'Tanda tangan 2'),
          status: eSign.status ? 'Aktif' : 'Tidak aktif',
          eSign: `/e-sign/${eSign.id}/view`,
          editLink: actions?.canEdit ? `/e-sign/${eSign.id}/edit` : null,
          deleteMethod: actions?.canDelete ? () => this.delteSignature(eSign) : null,
        }));
        this.totalPages = paging?.totalPage || 1;
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

  async delteSignature(eSign: ESign): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm('Anda Yakin?', `Apakah anda ingin menghapus E-Sign ini : ${eSign.name}?`, 'warning', 'Ya, hapus!');
    if(isConfirmed) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.eSignService.deleteESign(eSign.id).subscribe({
        next: () => {
          this.sweetalertService.alert('Dihapus!', 'Data E-Sign berhasil dihapus', 'success');
          this.eSign = this.eSign.filter(p => p.id !== eSign.id);

          if(this.eSign.length === 0 && this.currentPage > 0) {
            this.currentPage -= 1;
          }

          this.getListESign(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);

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
          this.sweetalertService.alert('Pemberitahuan', 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.', 'error');
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

  onSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }) {
    this.sortBy = event.sortBy;
    this.sortOrder = event.sortOrder;
    this.router.navigate([], {
      queryParams: { sort_by: this.sortBy, sort_order: this.sortOrder, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  viewAll(): void {
    if(this.eSign.length > 0) {

    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { keyword: undefined, page: undefined },
      queryParamsHandling: 'merge',
    });
    this.searchQuery = '';
  }
}
