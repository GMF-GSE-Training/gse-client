import { Component, OnInit } from '@angular/core';
import { VerticalTableComponent } from '../../../../components/vertical-table/vertical-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { DataManagementComponent } from '../../../../shared/components/data-management/data-management.component';
import { ParticipantCotModalComponent } from '../../../../components/participant-cot-modal/participant-cot-modal.component';
import { CommonModule } from '@angular/common';
import { ParticipantCotService } from '../../../../shared/service/participant-cot.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { CotService } from '../../../../shared/service/cot.service';
import { HeaderComponent } from '../../../../components/header/header.component';
import { CotNavigationService } from '../../../../shared/service/cot-navigation.service';
import { CertificateService } from '../../../../shared/service/certificate.service';

interface TableData {
  label: string;
  value: string | undefined;
}

@Component({
  selector: 'app-cot-detail',
  standalone: true,
  imports: [
    VerticalTableComponent,
    DataManagementComponent,
    ParticipantCotModalComponent,
    CommonModule,
    LoaderComponent,
    HeaderComponent
  ],
  templateUrl: './cot-detail.component.html',
  styleUrl: './cot-detail.component.css',
})
export class CotDetailComponent implements OnInit {
  cotId!: string;
  userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  verticalTableData: TableData[] = [];

  columns = [
    { header: 'No Pegawai', field: 'idNumber' },
    { header: 'Nama', field: 'name' },
    { header: 'Dinas', field: 'dinas' },
    ...(this.userProfile.role.name !== 'user' ? [
      { header: 'SIM', field: 'sim' },
      { header: 'Exp Surat Sehat & Buta Warna', field: 'expSuratSehatButaWarna' },
      { header: 'Exp Surat Bebas Narkoba', field: 'expSuratBebasNarkoba' },
    ] : []),
    { header: 'Action', field: 'action' },
  ];

  dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  isLoading: boolean = false;
  participantCots: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  state: { data: string } = { data: '' };
  isParticipantCotLoading: boolean = false;

  // Sorting state
  sortBy: string = 'idNumber';
  sortOrder: 'asc' | 'desc' = 'asc';

  modalColumns = [
    { header: 'No Pegawai', field: 'idNumber', sortable: true },
    { header: 'Nama', field: 'name', sortable: true },
    { header: 'Dinas', field: 'dinas', sortable: true },
    { header: 'Bidang', field: 'bidang', sortable: true },
    { header: 'Perusahaan', field: 'company', sortable: true },
    { header: 'Action', field: 'action', sortable: false },
  ];

  trainingName: string = '';
  showModal: boolean = false;
  selectedParticipantIds: (number | string)[] = [];
  unregisteredParticipants: any[] = [];
  modalTotalPages: number = 0;
  modalCurrentPage: number = 1;
  modalItemsPerPage: number = 10;
  isLoadingModal: boolean = false;
  updatedCount: number = 0;
  addedParticipants: string[] = [];
  cotStatus: string = '';

  // Modal sorting state
  modalSortBy: string = 'idNumber';
  modalSortOrder: 'asc' | 'desc' = 'asc';
  modalSearchQuery: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly participantCotService: ParticipantCotService,
    private readonly cotService: CotService,
    private readonly sweetalertService: SweetalertService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly cotNavigationService: CotNavigationService,
    private readonly certificateService: CertificateService,
  ) {
    const cotIdFromRoute = this.route.snapshot.paramMap.get('cotId');
    if (!cotIdFromRoute) {
      this.router.navigate(['/cot']);
      this.errorHandlerService.alertError(new Error('cotId tidak ditemukan di URL'));
      return;
    }
    this.cotId = cotIdFromRoute;
  }

  ngOnInit(): void {
    this.getCot();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.currentPage = +params['page'] || 1;
      this.sortBy = params['sortBy'] || 'idNumber';
      this.sortOrder = params['sortOrder'] || 'asc';
      this.getListParticipantCot(this.cotId, this.searchQuery, this.currentPage, this.itemsPerPage);
    });
  }

  getCot(): void {
    this.isLoading = true;
    this.cotService.getCotById(this.cotId).subscribe({
      next: ({ data }) => {
        this.trainingName = data.capability.trainingName ?? '';
        this.verticalTableData = [
          { label: 'Kode Rating', value: data.capability.ratingCode ?? '-' },
          { label: 'Nama training', value: data.capability.trainingName ?? '-' },
          { label: 'Tanggal Mulai', value: data.startDate ? new Date(data.startDate).toLocaleDateString('id-ID', this.dateOptions) : '-' },
          { label: 'Tanggal Selesai', value: data.endDate ? new Date(data.endDate).toLocaleDateString('id-ID', this.dateOptions) : '-' },
          { label: 'Lokasi Training', value: data.trainingLocation ?? '-' },
          { label: 'Instruktur Regulasi GSE', value: data.theoryInstructorRegGse ?? '-' },
          { label: 'Instruktur Teori Rating', value: data.theoryInstructorCompetency ?? '-' },
          { label: 'Instruktur Praktek 1', value: data.practicalInstructor1 ?? '-' },
          { label: 'Instruktur Praktek 2', value: data.practicalInstructor2 ?? '-' },
          { label: 'Jumlah Peserta', value: (data.numberOfParticipants ?? 0).toString() },
          { label: 'Status', value: data.status !== undefined && data.status !== null ? String(data.status) : '-' },
        ];
        this.cotStatus = data.status !== undefined && data.status !== null ? String(data.status) : '';
        this.updatedCount = data.numberOfParticipants ?? 0;
      },
      error: (error) => this.errorHandlerService.alertError(error),
      complete: () => this.isLoading = false
    });
  }

  async getListParticipantCot(cotId: string, searchQuery: string, currentPage: number, itemsPerPage: number): Promise<void> {
    this.isParticipantCotLoading = true;
    try {
      const response = await this.participantCotService.listParticipantCot(cotId, searchQuery, currentPage, itemsPerPage, this.sortBy, this.sortOrder).toPromise();
      if (!response || !response.data) {
        console.error('Invalid response from listParticipantCot');
        return;
      }

      const cot = response.data.cot;
      const participantCot = cot.participants;

      // Process participants and check certificate existence
      const participantPromises = participantCot.data?.map(async (participant: any) => {
        if (!participant) return null;

        let printLink = null;
        if (participantCot.actions?.canPrint && participant?.id) {
          try {
            // Check if certificate exists for this participant
            const certificateResponse = await this.certificateService.checkCertificateByParticipant(this.cotId, participant.id).toPromise();
            if (certificateResponse?.data && certificateResponse.data.id) {
              // Certificate exists, link to view page
              printLink = {
                path: `/cot/certificate/${certificateResponse.data.id}/view`,
                state: { previousUrl: `/cot/${this.cotId}/detail` },
                endDate: cot.endDate,
                showIcon: true
              };
            } else {
              // No certificate, link to create page with navigation state
              printLink = {
                path: `/cot/certificate/${this.cotId}/create/${participant.id}`,
                state: { previousUrl: `/cot/${this.cotId}/detail` },
                endDate: cot.endDate,
                showIcon: true
              };
            }
          } catch (error) {
            // If error (like 404), assume no certificate exists
            console.log(`🔍 No certificate found for participant ${participant.id}:`, error);
            printLink = {
              path: `/cot/certificate/${this.cotId}/create/${participant.id}`,
              state: { previousUrl: `/cot/${this.cotId}/detail` },
              endDate: cot.endDate,
              showIcon: true
            };
          }
        }

        const baseParticipant = {
          ...participant,
          idNumber: participant.idNumber ?? '-',
          dinas: participant.dinas ?? '-',
          printLink: printLink,
          detailLink: participantCot.actions?.canView && participant?.id ? `/participants/${participant.id}/detail` : null,
          deleteMethod: participantCot.actions?.canDelete ? () => this.deleteParticipantFromCot(cotId, participant?.id) : null,
        };

        return this.userProfile.role.name === 'user' ? baseParticipant : {
          ...baseParticipant,
          sim: participant?.id ? `/participants/${participant.id}/${participant.simB ? 'sim-b' : 'sim-a'}` : null,
          expSuratSehatButaWarna: participant?.id ? {
            label: new Date(new Date(participant.tglKeluarSuratSehatButaWarna).setMonth(new Date(participant.tglKeluarSuratSehatButaWarna).getMonth() + 6)).toLocaleDateString('id-ID', this.dateOptions),
            value: `/participants/${participant.id}/surat-sehat-buta-warna`
          } : null,
          expSuratBebasNarkoba: participant?.id ? {
            label: new Date(new Date(participant.tglKeluarSuratBebasNarkoba).setMonth(new Date(participant.tglKeluarSuratBebasNarkoba).getMonth() + 6)).toLocaleDateString('id-ID', this.dateOptions),
            value: `/participants/${participant.id}/surat-bebas-narkoba`
          } : null,
        };
      }) ?? [];

      // Wait for all certificate checks to complete
      const resolvedParticipants = await Promise.all(participantPromises);
      this.participantCots = resolvedParticipants.filter(Boolean);

      this.state.data = `/cot/${this.cotId}/detail`;
      this.totalPages = participantCot.paging.totalPage;
    } catch (error) {
      this.errorHandlerService.alertError(error);
    } finally {
      this.isParticipantCotLoading = false;
    }
  }

  getUnregisteredParticipants(cotId: string, searchQuery: string, currentPage: number, itemsPerPage: number): void {
    this.isLoadingModal = true;
    this.participantCotService.getUnregisteredParticipants(cotId, searchQuery, currentPage, itemsPerPage, this.modalSortBy, this.modalSortOrder).subscribe({
      next: ({ paging, data }) => {
        this.modalTotalPages = paging?.totalPage ?? 1;
        this.unregisteredParticipants = data.map((item: any) =>
          Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key, value ?? '-'])
          )
        );
      },
      error: (error) => this.errorHandlerService.alertError(error),
      complete: () => this.isLoadingModal = false
    });
  }

  onSearchChanged(query: string): void {
    this.router.navigate([], {
      queryParams: {
        q: query.trim() || null,
        page: query.trim() ? 1 : null,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      },
      queryParamsHandling: 'merge',
    });
  }

  async deleteParticipantFromCot(cotId: string, participantId: string): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm('Anda Yakin?', 'Apakah anda ingin menghapus peserta ini dari COT?', 'warning', 'Ya, hapus!');
    if (!isConfirmed) return;

    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.participantCotService.deleteParticipantFromCot(cotId, participantId).subscribe({
      next: () => {
        this.sweetalertService.alert('Berhasil!', 'Participant berhasil dihapus dari COT ini', 'success');
        this.participantCots = this.participantCots.filter(p => p.id !== participantId);
        this.currentPage = this.participantCots.length === 0 && this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;

        this.getCot();
        this.getListParticipantCot(cotId, this.searchQuery, this.currentPage, this.itemsPerPage);

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            ...(this.searchQuery && { q: this.searchQuery }),
            page: this.currentPage,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder
          },
          queryParamsHandling: 'merge',
        });
      },
      error: (error) => {
        console.error('Error deleting participant:', error);
        this.errorHandlerService.alertError(error);
      }
    });
  }

  onPageChanged(page: number): void {
    this.router.navigate([], {
      queryParams: {
        page,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      },
      queryParamsHandling: 'merge'
    });
  }

  viewAll(): void {
    this.searchQuery = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: null,
        page: null,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      },
      queryParamsHandling: 'merge'
    });
  }

  openModal(): void {
    this.showModal = true;
    this.getUnregisteredParticipants(this.cotId, '', this.modalCurrentPage, this.modalItemsPerPage);
  }

  closeModal(): void {
    this.selectedParticipantIds = [];
    this.showModal = false;
  }

  modalSearchChanged(searchQuery: string): void {
    this.modalSearchQuery = searchQuery;
    this.modalCurrentPage = 1;
    this.getUnregisteredParticipants(this.cotId, searchQuery, this.modalCurrentPage, this.modalItemsPerPage);
  }

  modalSearchCleared(): void {
    this.modalSearchQuery = '';
    this.getUnregisteredParticipants(this.cotId, '', this.modalCurrentPage, this.modalItemsPerPage);
  }

  modalPageChanged(page: number): void {
    this.modalCurrentPage = page;
    this.getUnregisteredParticipants(this.cotId, this.modalSearchQuery, this.modalCurrentPage, this.modalItemsPerPage);
  }

  // Modal sorting handler
  onModalSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }): void {
    this.modalSortBy = event.sortBy;
    this.modalSortOrder = event.sortOrder;
    this.modalCurrentPage = 1; // Reset to first page when sorting changes
    this.getUnregisteredParticipants(this.cotId, this.modalSearchQuery, this.modalCurrentPage, this.modalItemsPerPage);
  }

  // Sorting handlers
  onSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }): void {
    this.sortBy = event.sortBy;
    this.sortOrder = event.sortOrder;
    this.currentPage = 1; // Reset to first page when sorting changes
    this.getListParticipantCot(this.cotId, this.searchQuery, this.currentPage, this.itemsPerPage);

    // Update URL with sorting params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...(this.searchQuery && { q: this.searchQuery }),
        page: this.currentPage,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      },
      queryParamsHandling: 'merge',
    });
  }

  onSelectedIdsChange(ids: Set<number | string>): void {
    this.selectedParticipantIds = Array.from(ids);
  }

  saveSelectedParticipants(): void {
    if (!this.cotId) return;

    const requestPayload = {
      participantIds: this.selectedParticipantIds.map(id => String(id))
    };
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.participantCotService.addParticipantToCot(this.cotId, requestPayload).subscribe({
      next: (response) => {
        this.sweetalertService.alert('Berhasil!', response.data.message, 'success');
        this.updatedCount = response.data.updatedCount ?? this.updatedCount;
        this.addedParticipants = response.data.addedParticipants || [];

        this.verticalTableData = this.verticalTableData.map(item =>
          item.label === 'Jumlah Peserta' ? { ...item, value: this.updatedCount.toString() } : item
        );

        this.getListParticipantCot(this.cotId, this.searchQuery, this.currentPage, this.itemsPerPage);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error adding participants:', error);
        this.errorHandlerService.alertError(error);
      }
    });
  }

  /**
   * Navigate back to COT list with preserved filter state
   */
  navigateBackToCotList(): void {
    console.log('🔙 NAVIGATING BACK from COT detail to COT list with preserved state');
    this.cotNavigationService.navigateBack();
  }
}
