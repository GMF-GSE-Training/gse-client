import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../shared/model/user.model';
import { UserService } from '../../../../shared/service/user.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { DataManagementComponent } from "../../../../shared/components/data-management/data-management.component";
import { HeaderComponent } from "../../../../components/header/header.component";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DataManagementComponent,
    HeaderComponent
],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  // Komponen title
  pageTitle = 'Users';

  // Komponen tabel
  columns = [
    { header: 'No Pegawai', field: 'idNumber' },
    { header: 'Nama', field: 'name' },
    { header: 'Dinas', field: 'dinas' },
    { header: 'Role', field: 'roleName' },
    { header: 'Email', field: 'email' },
    { header: 'Action', field: 'action' }
  ];

  users: User[] = [];
  isLoading: boolean = false;

  // Komponen pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchQuery: string = '';
  isLoadingPagination: boolean = false;

  // Komponen Search
  placeHolder: string = 'Cari User';

  // State sorting universal
  sortBy: string = 'idNumber';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private sweetalertService: SweetalertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['keyword'] || '';
      this.currentPage =+ params['page'] || 1;
      this.sortBy = params['sort_by'] || 'idNumber';
      this.sortOrder = params['sort_order'] || 'asc';
      this.getListUsers(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);
    });
  }

  getListUsers(query: string, page: number, size: number, sortBy: string, sortOrder: string): void {
    this.isLoading = true;
    this.userService.listUsers(query, page, size, sortBy, sortOrder).subscribe({
      next: (response) => {
        this.users = response.data.map((user: User) => ({
          ...user,
          idNumber: user.idNumber ?? '-',
          dinas: user.dinas ?? '-',
          roleName: user.role?.name ?? '-',
        }));
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

  async deleteParticipant(user: User): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm('Anda Yakin?', `Apakah anda ingin menghapus peserta ini : ${user.idNumber}?`, 'warning', 'Ya, hapus!');
    if (isConfirmed) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.sweetalertService.alert('Dihapus!', 'Data peserta berhasil dihapus', 'success');
          this.users = this.users.filter(p => p.id !== user.id);

          if(this.users.length === 0 && this.currentPage > 0) {
            this.currentPage -= 1;
          }

          this.getListUsers(this.searchQuery, this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder);
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
}
