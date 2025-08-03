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

  constructor(
    private readonly certificateService: CertificateService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly sanitizer: DomSanitizer
  ) {}

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
    
    this.isLoadingPdf = true;
    this.pdfError = false;
    
    this.certificateService.getCertificatePdf(this.certificateId)
      .pipe(
        catchError((error) => {
          this.pdfError = true;
          console.error('Error loading PDF:', error);
          return of(null);
        })
      )
      .subscribe({
        next: (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
        },
        complete: () => {
          this.isLoadingPdf = false;
        }
      });
  }

  downloadPdf() {
    if (!this.certificateId || !this.certificate) return;
    
    this.certificateService.getCertificatePdf(this.certificateId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Create consistent filename format: Certificate_ParticipantName_ParticipantId.pdf
        let filename = `Certificate_${this.certificateId}.pdf`; // fallback
        
        if (this.certificate?.participant) {
          // Clean participant name (remove spaces and special characters, replace with underscores)
          const cleanName = this.certificate.participant.name
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^_|_$/g, '');
          
          filename = `Certificate_${cleanName}_${this.certificate.participant.id}.pdf`;
        }
        
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (error) => {
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
   * Get navigation link for back button
   * Returns COT detail link if certificate is loaded, otherwise COT list
   */
  getNavigationLink(): string {
    if (this.certificate) {
      return `/cot/${this.certificate.cotId}/detail`;
    }
    return '/cot';
  }
}

