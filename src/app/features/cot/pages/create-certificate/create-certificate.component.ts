import { Component } from '@angular/core';
import { CertificateFormComponent } from "../../components/certificate-form/certificate-form.component";
import { CertificateService } from '../../../../shared/service/certificate.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { CreateCertificate } from '../../../../shared/model/certificate.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-create-certificate',
  standalone: true,
  imports: [
    CertificateFormComponent
],
  templateUrl: './create-certificate.component.html',
  styleUrl: './create-certificate.component.css'
})
export class CreateCertificateComponent {
  private previousUrl: string;

  constructor(
    private readonly certificateService: CertificateService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { 
    // Get the previous URL from navigation state or construct based on cotId
    const navigation = this.router.getCurrentNavigation();
    const cotId = this.route.snapshot.paramMap.get('cotId');
    this.previousUrl = navigation?.extras.state?.['previousUrl'] || `/cot/${cotId}/detail`;
  }

  certificate: CreateCertificate = {
    theoryScore: 0,
    practiceScore: 0,
    attendance: 0
  }

  cotId = this.route.snapshot.paramMap.get('cotId');
  participantId = this.route.snapshot.paramMap.get('participantId');

  onSubmit(certificate: CreateCertificate) {
    if(this.cotId && this.participantId) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.certificateService.createCertificate(this.cotId, this.participantId, certificate).subscribe({
        next: (response) => {
          console.log('🔍 Certificate Creation Response:', response);
          console.log('🔍 Response Data:', response.data);
          console.log('🔍 Response Data Type:', typeof response.data);
          
          // Show success alert and wait for user to close it
          this.sweetalertService.alert('Berhasil', 'Sertifikat berhasil dibuat', 'success').then(() => {
            // After user closes the alert, do the redirect
            
            // Check if response.data is an object with id property
            if (response.data && typeof response.data === 'object' && response.data.id) {
              console.log('🎯 Redirecting to view certificate:', response.data.id);
              this.router.navigate([`/cot/certificate/${response.data.id}/view`], {
                state: { previousUrl: this.previousUrl }
              });
            } 
            // Check if response.data is a string (certificate ID)
            else if (response.data && typeof response.data === 'string') {
              // Check if it's a valid UUID format (basic check)
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
              if (uuidRegex.test(response.data)) {
                console.log('🎯 Redirecting to view certificate (UUID):', response.data);
                this.router.navigate([`/cot/certificate/${response.data}/view`], {
                  state: { previousUrl: this.previousUrl }
                });
              } else {
                console.log('⚠️ Response contains non-UUID string:', response.data);
                console.log('🔄 Backend might be returning a message instead of ID. Redirecting to COT detail.');
                this.router.navigateByUrl(this.previousUrl);
              }
            } 
            else {
              console.log('❌ No certificate ID found, redirecting to COT detail');
              console.log('📋 Available response properties:', Object.keys(response));
              if (response.data) {
                console.log('📋 Available data properties:', Object.keys(response.data));
              }
              this.router.navigateByUrl(this.previousUrl);
            }
          });
        },
        error: (error) => {
          console.log(error);
          this.errorHandlerService.alertError(error);
          this.router.navigateByUrl(this.previousUrl);
        }
      });
    }
  }
}
