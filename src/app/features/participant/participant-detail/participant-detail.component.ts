import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlueButtonComponent } from '../../../components/button/blue-button/blue-button.component';
import { VerticalTableComponent } from "../../../components/vertical-table/vertical-table.component";
import { TableComponent } from "../../../components/table/table.component";
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

@Component({
  selector: 'app-participant-detail',
  standalone: true,
  imports: [
    RouterLink,
    BlueButtonComponent,
    VerticalTableComponent,
    TableComponent,
    RoleBasedAccessDirective,
    CommonModule,
    WhiteButtonComponent,
    EmailFormCardComponent,
    PasswordUpdateFormCardComponent,
    LoaderComponent,
    HeaderComponent
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
  pasFoto: string | null = localStorage.getItem('pas_foto');
  qrCode: string | null = localStorage.getItem('qr_code');
  qrCodeDownloadName: string = 'QR_Code.png';
  id = this.route.snapshot.paramMap.get('participantId') || JSON.parse(localStorage.getItem('user_profile') || '{}').participant.id;
  idCardLink: string = '';

  dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  columns = [
    { header: 'Kompetensi', field: 'trainingName' },
    { header: 'Exp Sertifikat', field: 'expiryDate' },
  ];

  data: any[] = [];
  
  // Certificate table sorting
  certificateSortBy: string = 'trainingName';
  certificateSortOrder: 'asc' | 'desc' = 'asc';
  isLoadingCertificates: boolean = false;

  userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

  updateEmail: { email: string } = { email: '' };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly participantService: ParticipantService,
    private readonly authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    if (state) this.backButtonRoute = state['data'];
  }

ngOnInit(): void {
    // Subscribe to URL changes to set the selected tab
    this.route.url.subscribe(urlSegments => {
      const url = urlSegments.map(segment => segment.path).join('/');
      if (url.endsWith('profile/account')) {
        this.selectedItem = 1; // Tab Akun
      } else {
        this.selectedItem = 0; // Tab Data Pribadi
      }
    });

    this.loadCertificates();

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

    if (this.userProfile.role.name === 'user') {
      if (this.id !== this.userProfile.participant.id) this.getParticipantById();
      else this.getParticipantFromLocalStorage();
    } else {
      this.getParticipantById();
    }
  }

  private getParticipantFromLocalStorage() {
    this.isLoading = true;
    this.participant = this.userProfile.participant;
    if (this.participant) this.setParticipantData(this.participant);
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
      map(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })),
      switchMap(promise => from(promise))
    ).subscribe({
      next: (base64String: string) => {
        this.photoType = this.getMediaType(base64String);
        this.pasFoto = base64String.split(',')[1]; // Ambil bagian base64 saja
        if (this.userProfile.role.name === 'user') localStorage.setItem('pas_foto', this.pasFoto);
      },
      error: (error) => console.error('Error fetching photo:', error),
    });
  }

  private getQrCode(id: string): void {
    this.participantService.getQrCode(id).subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.qrCode = reader.result as string; // data:image/png;base64,...
          if (this.userProfile.role.name === 'user') {
            localStorage.setItem('qr_code', this.qrCode);
          }
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => console.error('Error fetching QR code:', error),
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
    this.participant = participant;
    this.verticalTableData = this.transformData(this.participant);
    this.editLink = `/participants/${this.id}/edit`;
    this.idCardLink = `/participants/${this.id}/id-card`;
    this.qrCodeDownloadName = `QR_Code_${participant.name.replace(/ /g, '_')}_${participant.id}.png`;

    if (this.userProfile.role.name === 'user') {
      localStorage.setItem('user_profile', JSON.stringify({ ...this.userProfile, participant: this.participant }));
    }

    if (this.participant) {
      this.getFoto(this.participant.id);
      this.getQrCode(this.participant.id);
      this.loadCertificates();
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
private loadCertificates(): void {
    this.isLoadingCertificates = true;
    this.participantService.getCertificates(this.id).subscribe({
      next: (response) => {
        if (response.data) {
          this.data = response.data.map(cert => {
            const rawExpiryDate = new Date(cert.expiryDate);
            return {
              ...cert,
              rawExpiryDate: rawExpiryDate,
expiryDate: rawExpiryDate.toLocaleDateString('id-ID', this.dateOptions),
              viewLink: `/cot/certificate/${cert.id}/view`,
              state: { previousUrl: this.router.url }
            };
          });
          this.sortCertificates();
        }
      },
      error: (error) => {
        console.error('Error loading certificates:', error);
        this.data = [];
      },
      complete: () => {
        this.isLoadingCertificates = false;
      }
    });
  }

  // Handle certificate table sorting
  onCertificateSortChange(event: { sortBy: string, sortOrder: 'asc' | 'desc' }): void {
    this.certificateSortBy = event.sortBy;
    this.certificateSortOrder = event.sortOrder;
    this.sortCertificates();
  }

  // Sort certificates based on current sort criteria
  private sortCertificates(): void {
    if (!this.data || this.data.length === 0) return;
    
    this.data.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      if (this.certificateSortBy === 'expiryDate') {
        aValue = a.rawExpiryDate ? a.rawExpiryDate.getTime() : 0;
        bValue = b.rawExpiryDate ? b.rawExpiryDate.getTime() : 0;
      } else {
        aValue = (a[this.certificateSortBy] || '').toString().toLowerCase();
        bValue = (b[this.certificateSortBy] || '').toString().toLowerCase();
      }
      
      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      return this.certificateSortOrder === 'desc' ? -comparison : comparison;
    });
  }
}
