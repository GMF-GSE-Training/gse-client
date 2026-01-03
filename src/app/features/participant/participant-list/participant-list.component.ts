import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../shared/service/participant.service';
import { Participant } from '../../../shared/model/participant.model';
import { SweetalertService } from '../../../shared/service/sweetalert.service';
import { DataManagementComponent } from "../../../shared/components/data-management/data-management.component";
import { HeaderComponent } from "../../../components/header/header.component";
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [
    DataManagementComponent,
    HeaderComponent
],
  templateUrl: './participant-list.component.html',
})
export class ParticipantListComponent implements OnInit {
  // Komponen title
  pageTitle = 'Participants';

  // Komponen tabel
  columns = [
    { header: 'No Pegawai', field: 'idNumber' },
    { header: 'Nama', field: 'name' },
    { header: 'Dinas', field: 'dinas' },
    { header: 'Bidang', field: 'bidang' },
    { header: 'Perusahaan', field: 'company' },
    { header: 'Email', field: 'email' },
    { header: 'Action', field: 'action' }
  ];

  participants: Participant[] = [];
  isLoading: boolean = false;

  // Komponen pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';

  // Komponen Search
  placeHolder: string = 'Cari Participant';

  // Role Bassed Access
  roleBassedAccess: string[] = ['super admin', 'supervisor', 'lcu'];

  // State sorting universal
  sortBy: string = 'idNumber';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private participantService: ParticipantService,
    private sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['keyword'] || '';
      this.currentPage =+ params['page'] || 1;
      this.sortBy = params['sort_by'] || 'idNumber';
      this.sortOrder = params['sort_order'] || 'asc';
      this.getListParticipants(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);
    });
  }

  getListParticipants(query: string, page: number, size: number, sortBy: string, sortOrder: string): void {
    this.isLoading = true;
    this.participantService.listParticipants(query, page, size, sortBy, sortOrder).subscribe({
      next: (response) => {
        this.participants = this.mapParticipants(response);
        this.totalPages = response.paging?.totalPage ?? 1;
      },
      error: (error) => {
        console.log(error);
        this.sweetalertService.alert('Pemberitahuan', 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  async deleteParticipant(participant: Participant): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm('Anda Yakin?', `Apakah anda ingin menghapus peserta ini : ${participant.name}?`, 'warning', 'Ya, hapus!');
    if (isConfirmed) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.participantService.deleteParticipant(participant.id).subscribe({
        next: () => {
          this.sweetalertService.alert('Dihapus!', 'Data peserta berhasil dihapus', 'success');
          this.participants = this.participants.filter(p => p.id !== participant.id);

          if(this.participants.length === 0 && this.currentPage > 0) {
            this.currentPage -= 1;
          }

          this.getListParticipants(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);

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
    if(this.participants.length > 0) {

    }
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

  private mapParticipants(response: any): Participant[] {
    return response.data.map((participant: Participant) => ({
      ...participant,
      idNumber: participant.idNumber ?? '-',
      dinas: participant.dinas ?? '-',
      bidang: participant.bidang ?? '-',
      company: participant.company ?? '-',
      editLink: response.actions?.canEdit ? `/participants/${participant.id}/edit` : null,
      detailLink: response.actions?.canView ? `/participants/${participant.id}/detail` : null,
      deleteMethod: response.actions?.canDelete ? () => this.deleteParticipant(participant) : null,
    }));
  }
}
