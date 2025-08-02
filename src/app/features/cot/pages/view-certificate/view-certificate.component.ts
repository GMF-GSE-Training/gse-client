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
        link.href = url;
        link.download = `Certificate_${this.certificate?.id || this.certificateId}.pdf`;
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

