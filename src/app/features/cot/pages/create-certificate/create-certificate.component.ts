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
  constructor(
    private readonly certificateService: CertificateService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  certificate: CreateCertificate = {
    theoryScore: 0,
    practiceScore: 0,
    certificateNumber: ""
  }

  cotId = this.route.snapshot.paramMap.get('cotId');
  participantId = this.route.snapshot.paramMap.get('participantId');

  onSubmit(certificate: CreateCertificate) {
    if(this.cotId && this.participantId) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.certificateService.createCertificate(this.cotId, this.participantId, certificate).subscribe({
        next: () => {
          this.sweetalertService.alert('Berhasil', 'Sertifikat berhasil dibuat', 'success');
          this.router.navigateByUrl(`/cot/${this.cotId}/detail`);
        },
        error: (error) => {
          console.log(error);
          this.errorHandlerService.alertError(error);
          this.router.navigateByUrl(`/cot/${this.cotId}/detail`);
        }
      });
    }
  }
}
