import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CertificateService } from '../../../../shared/service/certificate.service';
import { CertificateResponse } from '../../../../shared/model/certificate.model';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { DisplayFilesComponent } from '../../../../shared/components/display-files/display-files.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-view-certificate',
  standalone: true,
  imports: [
    CommonModule,
    DisplayFilesComponent,
    LoaderComponent
  ],
  templateUrl: './view-certificate.component.html',
  styleUrl: './view-certificate.component.css'
})
export class ViewCertificateComponent implements OnInit {
  certificateId: string | null = null;
  certificate: CertificateResponse | null = null;
  isLoading: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;
  isLoadingPdf: boolean = false;
  pdfError: boolean = false;
  userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

  private previousUrl: string;

  constructor(
    private readonly certificateService: CertificateService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly sanitizer: DomSanitizer
  ) { 
    const navigation = this.router.getCurrentNavigation();
    this.previousUrl = navigation?.extras.state?.['previousUrl'] || '/cot';
  }

  ngOnInit(): void {
    this.certificateId = this.route.snapshot.paramMap.get('certificateId');
    if (this.certificateId) {
      this.loadCertificate();
    }
  }

  loadCertificate() {
    if (!this.certificateId) return;

    this.isLoading = true;
    this.certificateService.getCertificateById(this.certificateId).subscribe({
      next: (response) => {
        if (response.data) {
          this.certificate = response.data;
          // Load PDF preview after certificate data is loaded
          this.loadPdfPreview();
        }
      },
      error: (error) => {
        this.errorHandlerService.alertError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadPdfPreview() {
    if (!this.certificateId) return;

    console.log('🔍 ViewCertificate: Starting PDF preview load for certificate:', this.certificateId);
    this.isLoadingPdf = true;
    this.pdfError = false;

    this.certificateService.getCertificatePdf(this.certificateId)
      .pipe(
        catchError((error) => {
          this.pdfError = true;
          console.error('❌ ViewCertificate: Error loading PDF preview:', error);
          console.error('❌ ViewCertificate: Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url
          });
          return of(null);
        })
      )
      .subscribe({
        next: (blob) => {
          console.log('📁 ViewCertificate: PDF blob received:', blob);
          if (blob) {
            console.log('📁 ViewCertificate: Blob size:', blob.size, 'bytes');
            console.log('📁 ViewCertificate: Blob type:', blob.type);

            if (blob.size > 0) {
              const url = URL.createObjectURL(blob);
              this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
              console.log('✅ ViewCertificate: PDF preview URL created successfully');
            } else {
              console.warn('⚠️ ViewCertificate: Received empty PDF blob');
              this.pdfError = true;
            }
          } else {
            console.warn('⚠️ ViewCertificate: No PDF blob received');
            this.pdfError = true;
          }
        },
        complete: () => {
          this.isLoadingPdf = false;
          console.log('🔍 ViewCertificate: PDF preview load completed');
        }
      });
  }

  downloadPdf() {
    if (!this.certificateId || !this.certificate) {
      console.warn('⚠️ ViewCertificate: Download failed - missing certificateId or certificate data');
      return;
    }

    console.log('🔽 ViewCertificate: Starting PDF download for certificate:', this.certificateId);
    console.log('🔽 ViewCertificate: Certificate data:', this.certificate);

    this.certificateService.getCertificatePdf(this.certificateId).subscribe({
      next: (blob) => {
        console.log('📁 ViewCertificate: Download blob received:', blob);
        console.log('📁 ViewCertificate: Download blob size:', blob?.size, 'bytes');
        console.log('📁 ViewCertificate: Download blob type:', blob?.type);

        if (!blob || blob.size === 0) {
          console.error('❌ ViewCertificate: Download failed - empty or invalid blob');
          this.errorHandlerService.alertError({
            message: 'File PDF kosong atau tidak valid',
            status: 0
          });
          return;
        }

        try {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          // Create consistent filename format: Certificate_ParticipantName_ParticipantId.pdf
          let filename = `Certificate_${this.certificateId}.pdf`; // fallback

          if (this.certificate?.participant) {
            // Clean participant name (remove spaces and special characters, replace with underscores)
            const cleanName = this.certificate.participant.name
              .replace(/[^a-zA-Z0-9]/g, '_')
              .replace(/_{2,}/g, '_')
              .replace(/^_|_$/g, '');

            filename = `GSE_Training_Certificate_${cleanName}_${this.certificate.participant.id}.pdf`;
          }

          console.log('📝 ViewCertificate: Download filename:', filename);
          link.download = filename;

          // Append to document and trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up
          setTimeout(() => URL.revokeObjectURL(url), 100);

          console.log('✅ ViewCertificate: PDF download initiated successfully');
        } catch (error) {
          console.error('❌ ViewCertificate: Error creating download link:', error);
          this.errorHandlerService.alertError({
            message: 'Gagal memproses file untuk download',
            status: 0
          });
        }
      },
      error: (error) => {
        console.error('❌ ViewCertificate: Download request failed:', error);
        console.error('❌ ViewCertificate: Download error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.errorHandlerService.alertError(error);
      }
    });
  }

  printCertificate() {
    window.print();
  }

  /**
   * Delete certificate with confirmation
   */
  async deleteCertificate(): Promise<void> {
    if (!this.certificateId || !this.certificate) return;

    const isConfirmed = await this.sweetalertService.confirm(
      'Anda Yakin?',
      'Apakah anda ingin menghapus sertifikat ini? Tindakan ini tidak dapat dibatalkan.',
      'warning',
      'Ya, hapus!'
    );

    if (!isConfirmed) return;

    this.sweetalertService.loading('Mohon tunggu', 'Menghapus sertifikat...');

    this.certificateService.deleteCertificate(this.certificateId).subscribe({
      next: (response) => {
        this.sweetalertService.alert('Berhasil!', 'Sertifikat berhasil dihapus', 'success').then(() => {
          if (this.certificate) {
            // Redirect to create certificate page with specific COT and participant IDs
            this.router.navigateByUrl(`/cot/certificate/${this.certificate.cotId}/create/${this.certificate.participantId}`);
          }
        });
      },
      error: (error) => {
        console.error('Error deleting certificate:', error);
        this.errorHandlerService.alertError(error);
      }
    });
  }

  /**
   * Check if current user can delete certificates
   * Only super admin, supervisor, and lcu can delete certificates
   */
  canDeleteCertificate(): boolean {
    const userRole = this.userProfile?.role?.name?.toLowerCase();
    return ['super admin', 'supervisor', 'lcu'].includes(userRole);
  }

  /**
   * Get navigation link for back button
   * Returns COT detail link if certificate is loaded, otherwise COT list
   */
  getNavigationLink(): string {
    return this.previousUrl;
  }
}

