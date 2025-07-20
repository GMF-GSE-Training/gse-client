import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CotFormComponent } from "../../components/cot-form/cot-form.component";
import { CotService } from '../../../../shared/service/cot.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { UpdateCot } from '../../../../shared/model/cot.model';

@Component({
  selector: 'app-edit-cot',
  standalone: true,
  imports: [
    CotFormComponent
],
  templateUrl: './edit-cot.component.html',
})
export class EditCotComponent implements OnInit {
  cot: UpdateCot = {
    id: '',
    capabilityId: '',
    startDate: undefined!,
    endDate: undefined!,
    trainingLocation: '',
    theoryInstructorRegGse: '',
    theoryInstructorCompetency: '',
    practicalInstructor1: '',
    practicalInstructor2: '',
    status: undefined!,
  }

  constructor(
    private readonly cotService: CotService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sweetalertService: SweetalertService,
  ) { }

  initialCapability: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('cotId');
    if(id) {
      this.cotService.getCotById(id).subscribe({
        next: (response) => {
          // Casting response.data ke Cot untuk memastikan tipe data yang benar
          const cotData = response.data;

          // Mapping data dari response ke UpdateCot
          this.cot = {
            id: cotData.id,
            capabilityId: cotData.capability?.id, // Mengambil id dari Capability
            startDate: cotData.startDate ? new Date(cotData.startDate).toISOString().split('T')[0] : undefined,
            endDate: cotData.endDate ? new Date(cotData.endDate).toISOString().split('T')[0] : undefined,
            trainingLocation: cotData.trainingLocation,
            theoryInstructorRegGse: cotData.theoryInstructorRegGse,
            theoryInstructorCompetency: cotData.theoryInstructorCompetency,
            practicalInstructor1: cotData.practicalInstructor1,
            practicalInstructor2: cotData.practicalInstructor2,
            status: cotData.status
          };

          this.initialCapability = this.cot.capabilityId!;
        },
        error: (error) => console.log(error)
      })
    }
  }

  onSubmit() {
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.cotService.updateCot(this.cot.id, this.cot).subscribe({
      next: () => {
        this.router.navigateByUrl('/cot');
        this.sweetalertService.alert('Berhasil', 'COT berhasil diperbarui', 'success');
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.alertError(error);
      }
    })
  }
}
