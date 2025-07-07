import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapabilityService } from '../../../shared/service/capability.service';
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { CapabilityFormComponent } from "../components/capability-form/capability-form.component";
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';

@Component({
  selector: 'app-edit-capability',
  standalone: true,
  imports: [
    CapabilityFormComponent
  ],
  templateUrl: './edit-capability.component.html',
})
export class EditCapabilityComponent implements OnInit {
  capability = {
    id: '',
    ratingCode: '',
    trainingCode: '',
    trainingName: '',
  };
  isLoading: boolean = false;

  constructor(
    private readonly capabilityService: CapabilityService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('capabilityId');
    if(id) {
      this.isLoading = true;
      this.capabilityService.getCapabilityById(id).subscribe({
        next: (response) => {
          this.capability = response.data;
        },
        error: (error) => console.log(error),
        complete: () => this.isLoading = false
      })
    }
  }

  onSubmit(capability: any) {
    const { id, ...request } = capability;
    this.capabilityService.updateCapability(id, request).subscribe({
      next: () => {
        this.sweetalertService.alert('Berhasil', 'Capability berhasil diperbarui', 'success');
        this.router.navigateByUrl('/capability');
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.alertError(error);
      }
    })
  }
}
