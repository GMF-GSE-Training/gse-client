import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateFormComponent } from '../../../cot/components/certificate-form/certificate-form.component';
import { CertificateService } from '../../../../shared/service/certificate.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { UpdateCertificate } from '../../../../shared/model/certificate.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-certificate',
  standalone: true,
  imports: [
    CertificateFormComponent
  ],
  templateUrl: './edit-certificate.component.html',
  styleUrl: './edit-certificate.component.css'
})
export class EditCertificateComponent implements OnInit {
  constructor(
    private readonly certificateService: CertificateService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sweetalertService: SweetalertService,
    private readonly route: ActivatedRoute,
    private readonly location: Location
  ) { }

  certificate: UpdateCertificate & {
    idNumber?: string;
    name?: string;
    trainingName?: string;
    cotId?: string;
    participantId?: string;
  } = {
    theoryScore: 0,
    practiceScore: 0,
    certificateNumber: ""
  }

  certificateId = this.route.snapshot.paramMap.get('certificateId');
  backButtonRoute: string = '/participants';

  ngOnInit(): void {
    // Try to get navigation state for back button
    const navigation = this.router.getCurrentNavigation();
    let state = navigation?.extras.state;

    // Fallback to Location state
    if (!state) {
      const locationState = this.location.getState() as any;
      if (locationState && locationState.data) {
        state = locationState;
      }
    }

    // Final fallback: window.history.state
    if (!state && window.history.state && window.history.state.data) {
      state = window.history.state;
    }

    if (state && state['data']) {
      this.backButtonRoute = state['data'];
    }

    if (this.certificateId) {
      this.getCertificateById();
    }
  }

  onUpdate(certificate: UpdateCertificate) {
    if(this.certificateId) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.certificateService.updateCertificate(this.certificateId, certificate).subscribe({
        next: () => {
          this.sweetalertService.alert('Berhasil', 'Sertifikat berhasil diupdate', 'success');
          this.router.navigate([this.backButtonRoute]);
        },
        error: (error) => {
          this.errorHandlerService.alertError(error);
        }
      });
    }
  }

  private getCertificateById(): void {
    if(this.certificateId) {
      this.certificateService.getCertificateById(this.certificateId).subscribe({
        next: ({ data }) => {
          // Map response to form data - API already includes all necessary data
          const certData = data as any;
          this.certificate = {
            theoryScore: certData.theoryScore || 0,
            practiceScore: certData.practiceScore || 0,
            certificateNumber: certData.certificateNumber || '',
            cotId: certData.cotId,
            participantId: certData.participantId,
            // Map field names from API response to form component expected names
            idNumber: certData.noPegawai || '',
            name: certData.nama || '',
            trainingName: certData.namaTraining || ''
          };
        },
        error: (error) => {
          console.error('Error fetching certificate:', error);
          this.errorHandlerService.alertError(error);
        }
      });
    }
  }
}

