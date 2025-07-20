import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CotFormComponent } from "../../components/cot-form/cot-form.component";
import { CreateCot } from '../../../../shared/model/cot.model';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { CotService } from '../../../../shared/service/cot.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';

@Component({
  selector: 'app-add-cot',
  standalone: true,
  imports: [
    CotFormComponent
  ],
  templateUrl: './add-cot.component.html',
})
export class AddCotComponent {
  cot: CreateCot = {
    capabilityId: '',
    startDate: undefined!,
    endDate: undefined!,
    trainingLocation: '',
    theoryInstructorRegGse: '',
    theoryInstructorCompetency: '',
    practicalInstructor1: '',
    practicalInstructor2: ''
  }

  constructor(
    private readonly cotService: CotService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sweetalertService: SweetalertService,
  ) { }

  onSubmit(cot: CreateCot) {
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.cotService.createCot(cot).subscribe({
      next: () => {
        this.router.navigateByUrl('/cot');
        this.sweetalertService.alert('Berhasil', 'COT berhasil dibuat', 'success');
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.alertError(error);
      }
    })
  }
}
