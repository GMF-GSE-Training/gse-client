import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CapabilityService } from '../../../shared/service/capability.service';
import { CapabilityFormComponent } from "../components/capability-form/capability-form.component";
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';
import { SweetalertService } from '../../../shared/service/sweetaler.service';

@Component({
  selector: 'app-add-capability',
  standalone: true,
  imports: [CapabilityFormComponent],
  templateUrl: './add-capability.component.html',
})
export class AddCapabilityComponent {
  capability = {
    id: '',
    kodeRating: '',
    kodeTraining: '',
    namaTraining: '',
  };

  constructor(
    private readonly capabilityService: CapabilityService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sweetalertService: SweetalertService,
  ) { }

  onSubmit(capability: any) {
    const { id, ...request } = capability;
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.capabilityService.createCapability(request).subscribe({
      next: (response) => {
        capability = response.data;
        this.sweetalertService.alert('Berhasil!', 'Capability berhasil dibuat, selanjutnya buat kurikulum & silabus', 'success');
        this.router.navigateByUrl('/curriculum-syllabus/add', {
          state: {
            id: capability.id,
            ratingCode: capability.ratingCode,
            trainingName: capability.trainingName,
          }
        });
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.alertError(error);
      }
    })
  }
}
