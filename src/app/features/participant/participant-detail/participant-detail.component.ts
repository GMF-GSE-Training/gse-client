import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlueButtonComponent } from '../../../components/button/blue-button/blue-button.component';
import { VerticalTableComponent } from "../../../components/vertical-table/vertical-table.component";
import { ParticipantService } from '../../../shared/service/participant.service';
import { Participant } from '../../../shared/model/participant.model';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { RoleBasedAccessDirective } from '../../../shared/directive/role-based-access.directive';
import { CommonModule } from '@angular/common';
import { WhiteButtonComponent } from "../../../components/button/white-button/white-button.component";
import { SweetalertService } from '../../../shared/service/sweetalert.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';
import saveAs from 'file-saver';
import { EmailFormCardComponent } from "../../../components/card/email-form-card/email-form-card.component";
import { PasswordUpdateFormCardComponent } from "../../../components/card/password-update-form-card/password-update-form-card.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { AuthService } from '../../../shared/service/auth.service';
import { UpdatePassword } from '../../../shared/model/auth.model';
import { HeaderComponent } from "../../../components/header/header.component";
import { Certificate } from '../../../shared/model/certificate.model';
import { DataManagementComponent } from "../../../shared/components/data-management/data-management.component";
import { CertificateService } from '../../../shared/service/certificate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-participant-detail',
  standalone: true,
  imports: [
    RouterLink,
    BlueButtonComponent,
    VerticalTableComponent,
    RoleBasedAccessDirective,
    CommonModule,
    WhiteButtonComponent,
    EmailFormCardComponent,
    PasswordUpdateFormCardComponent,
    LoaderComponent,
    HeaderComponent,
    DataManagementComponent
],
  templateUrl: './participant-detail.component.html',
  styleUrl: './participant-detail.component.css'
})
export class ParticipantDetailComponent implements OnInit {
  participant: Participant | null = null;
  verticalTableData: any[] = [];
  editLink: string = '';
  photoType: string | null = null;
  backButtonRoute: string = '/participants';
  selectedItem: number = 0;
  isLoading: boolean = false;
  pasFoto: SafeResourceUrl | string = "";
  qrCode: SafeResourceUrl | string = "";
  qrCodeDownloadName: string = 'QR_Code.png';
  id = this.route.snapshot.paramMap.get('participantId') || JSON.parse(localStorage.getItem('user_profile') || '{}').participant.id;
  idCardLink: string = '';

  dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  columns = [
    { header: 'Kompetensi', field: 'capabilityName' },
    { header: 'Exp Sertifikat', field: 'expDate' },
    { header: 'Action', field: 'action' }
  ];

  certificates: Certificate[] = [];
  
  // Certificate table pagination and search
  certificateCurrentPage: number = 1;
  certificateTotalPages: number = 1;
  certificateItemsPerPage: number = 10;
  certificateSearchQuery: string = '';
  
  // Certificate table sorting (using table field names)
  certificateSortBy: string = 'expiryDate';
  certificateSortOrder: 'asc' | 'desc' = 'asc';
  isLoadingCertificates: boolean = false;

  userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

  updateEmail: { email: string } = { email: '' };

  // State untuk navigasi certificate view
  certificateNavigationState: { data: string } = { data: '' };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly participantService: ParticipantService,
    private readonly authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly certificateService: CertificateService,
    private readonly sanitizer: DomSanitizer,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    if (state) this.backButtonRoute = state['data'];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.sweetalertService.alert('Gagal', params['error'], 'error');
        this.router.navigate([], { relativeTo: this.route, queryParams: { error: null }, queryParamsHandling: 'merge' });
      } else if (params['success']) {
        this.sweetalertService.alert('Sukses', params['success'], 'success');
        this.getParticipantById();
        this.router.navigate([], { relativeTo: this.route, queryParams: { success: null }, queryParamsHandling: 'merge' });
      }
    });

    // Set certificate navigation state untuk kembali ke halaman participant detail saat ini
    if (this.userProfile?.role?.name === 'user') {
      this.certificateNavigationState = { data: `/participants/${this.id}/profile/personal` };
    } else {
      this.certificateNavigationState = { data: `/participants/${this.id}/detail` };
    }

    this.route.url.subscribe(urlSegments => {
      const url = urlSegments.map(segment => segment.path).join('/');
      this.selectedItem = url === `participants/${this.id}/profile/personal` ? 0 : url === `participants/${this.id}/profile/account` ? 1 : 0;
      
      // Update certificate navigation state jika URL berubah
      if (this.userProfile?.role?.name === 'user') {
        this.certificateNavigationState = { data: `/participants/${this.id}/profile/personal` };
      } else {
        this.certificateNavigationState = { data: `/participants/${this.id}/detail` };
      }
    });

    if (this.userProfile?.role?.name === 'user') {
      if (this.id !== this.userProfile?.participant?.id) this.getParticipantById();
      else this.getParticipantFromLocalStorage();
    } else {
      this.getParticipantById();
    }
    
    this.getFoto(this.id);
    this.getQrCode(this.id);
    this.getListCertificates();
  }

  private getParticipantFromLocalStorage() {
    this.isLoading = true;
    this.participant = this.userProfile.participant;
    this.isLoading = false;
  }

  private getParticipantById() {
    this.isLoading = true;
    this.participantService.getParticipantById(this.id).subscribe({
      next: (response) => {
        if (response.data) {
          this.setParticipantData(response.data);
        } else {
          this.participant = null;
        }
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private getFoto(id: string): void {
    this.participantService.getFoto(id).pipe(
      map(response => response.data)
    ).subscribe({
      next: (pasFoto: string) => {
        this.pasFoto = this.sanitizer.bypassSecurityTrustResourceUrl(pasFoto);
      },
      error: (error) => console.error('Error fetching photo:', error),
    });
  }

  private getQrCode(id: string): void {
    this.participantService.getQrCode(id).pipe(
      map(response => response.data)
    ).subscribe({
      next: (qrCode: string) => {
        this.qrCode = this.sanitizer.bypassSecurityTrustResourceUrl(qrCode);
      },
      error: (error) => console.error('Error fetching photo:', error),
    });
  }

  downloadDocument() {
    if (this.id) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.participantService.downloadAllFiles(this.id).subscribe({
        next: (response) => {
          const filename = `AllFiles_${this.participant?.name?.replace(/\s+/g, '_') || 'Participant'}_${this.id}.zip`;
          saveAs(response, filename);
          this.sweetalertService.close();
        },
        error: (error) => {
          this.sweetalertService.close();
          this.sweetalertService.alert('Gagal!', 'Data tidak ditemukan.', 'error');
        },
      });
    }
  }

  updateEmailSubmit(data: { email: string }): void {
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.updateEmailRequest(data).subscribe({
      next: () => {
        this.sweetalertService.alert(
          'Berhasil',
          `Kami telah mengirimkan email verifikasi ke ${data.email}. Silakan buka tautan untuk menyelesaikan proses.`,
          'success'
        );
      },
      error: (error) => this.errorHandlerService.alertError(error),
    });
  }

  updatePasswordSubmit(data: UpdatePassword): void {
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.updatePassword(data).subscribe({
      next: () => {
        this.sweetalertService.alert('Berhasil', 'Password berhasil diubah', 'success');
      },
      error: (error) => this.errorHandlerService.alertError(error),
    });
  }

  private setParticipantData(participant: Participant) {
    if(participant) {
      this.participant = participant;
      this.verticalTableData = this.transformData(this.participant);
      this.qrCodeDownloadName = `QR_Code_${participant.name.replace(/ /g, '_')}_${participant.id}.png`;
    }
    this.editLink = `/participants/${this.id}/edit`;
    this.idCardLink = `/participants/${this.id}/id-card`;

    if (this.userProfile.role.name === 'user') {
      localStorage.setItem('user_profile', JSON.stringify({ ...this.userProfile, participant: this.participant }));
    }
  }

  private transformData(participant: Participant): any[] {
    return [
      { label: 'No Pegawai', value: participant.idNumber ?? '-' },
      { label: 'Nama Peserta', value: participant.name },
      { label: 'Dinas', value: participant.dinas ?? '-' },
      { label: 'Bidang', value: participant.bidang ?? '-' },
      { label: 'Perusahaan', value: participant.company ?? '-' },
      { label: 'Email', value: participant.email },
      { label: 'No Telp', value: participant.phoneNumber ?? '-' },
      { label: 'Tempat Lahir', value: participant.placeOfBirth ?? '-' },
      { label: 'Tanggal Lahir', value: new Date(participant.dateOfBirth).toLocaleDateString('id-ID', this.dateOptions) },
      { label: 'SIM A', link: `/participants/${participant.id}/sim-a` },
      { label: 'SIM B', link: `/participants/${participant.id}/sim-b` },
      { label: 'KTP', link: `/participants/${participant.id}/ktp` },
      { label: 'Exp Surat Sehat & Buta Warna',
        value: new Date(new Date(participant.tglKeluarSuratSehatButaWarna).setMonth(new Date(participant.tglKeluarSuratSehatButaWarna).getMonth() + 6)).toLocaleDateString('id-ID', this.dateOptions),
        link: `/participants/${participant.id}/surat-sehat-buta-warna` },
      { label: 'Exp Surat Bebas Narkoba',
        value: new Date(new Date(participant.tglKeluarSuratBebasNarkoba).setMonth(new Date(participant.tglKeluarSuratBebasNarkoba).getMonth() + 6)).toLocaleDateString('id-ID', this.dateOptions),
        link: `/participants/${participant.id}/surat-bebas-narkoba` },
    ];
  }

  private getMediaType(dataURL: string): string {
    const mime = dataURL.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    return mime && mime.length > 0 ? mime[1] : '';
  }

  // Load certificates for the participant
  private getListCertificates(): void {
    this.isLoadingCertificates = true;
    // Map sortBy from table field to backend field
    const backendSortBy = this.certificateSortBy === 'trainingName' ? 'capabilityName' : this.certificateSortBy === 'expDate' ? 'expDate' : 'expDate';
    
    this.certificateService.listCertificates(
      this.certificateSearchQuery || undefined,
      this.certificateCurrentPage,
      this.certificateItemsPerPage,
      backendSortBy,
      this.certificateSortOrder
    ).subscribe({
      next: ({ data, actions, paging }) => {
        // Map backend response to table format
        this.certificates = data.map((cert: any) => ({
          id: cert.id,
          cotId: cert.cotId,
          capabilityName: cert.capabilityName,
          expDate: cert.expDate ? new Date(cert.expDate).toLocaleDateString('id-ID', this.dateOptions) : '-',
          detailLink: actions?.canView
            ? `/certificates/${cert.id}/view`
            : '',
          editLink: actions?.canEdit
            ? `/certificates/${cert.id}/edit`
            : '',
          deleteMethod: actions?.canDelete ? () => this.deleteCertificate(cert) : null,
          cotDetail: `/cot/${cert.cotId}/detail`
        }));
        this.certificateTotalPages = paging?.totalPage ?? 1;
      },
      error: (error) => {
        console.error('Error fetching certificates:', error);
        this.errorHandlerService.alertError(error);
        this.isLoadingCertificates = false;
      },
      complete: () => {
        this.isLoadingCertificates = false;
      }
    });
  }

  onCertificateSearchChanged(query: string): void {
    this.certificateSearchQuery = query;
    this.certificateCurrentPage = 1;
    this.getListCertificates();
  }

  onCertificatePageChanged(page: number): void {
    this.certificateCurrentPage = page;
    this.getListCertificates();
  }

  onCertificateSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }): void {
    this.certificateSortBy = event.sortBy;
    this.certificateSortOrder = event.sortOrder;
    this.certificateCurrentPage = 1;
    this.getListCertificates();
  }

  viewAllCertificates(): void {
    this.certificateSearchQuery = '';
    this.certificateCurrentPage = 1;
    this.getListCertificates();
  }

  async deleteCertificate(cert: Certificate): Promise<void> {
    const isConfirmed = await this.sweetalertService.confirm(
      'Anda Yakin?',
      `Apakah anda ingin menghapus sertifikat ${cert.capabilityName}?`,
      'warning',
      'Ya, hapus!'
    );
    if (isConfirmed) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.certificateService.deleteCertificate(cert.id).subscribe({
        next: () => {
          this.sweetalertService.alert('Dihapus!', 'Data sertifikat berhasil dihapus', 'success');
          this.certificates = this.certificates.filter(c => c.id !== cert.id);

          if (this.certificates.length === 0 && this.certificateCurrentPage > 0) {
            this.certificateCurrentPage -= 1;
          }

          this.getListCertificates();
        },
        error: (error) => {
          console.error(error);
          this.errorHandlerService.alertError(error);
        }
      });
    }
  }
}
