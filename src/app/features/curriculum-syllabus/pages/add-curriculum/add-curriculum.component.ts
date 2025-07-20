import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurriculumSyllabusService } from '../../../../shared/service/curriculum-syllabus.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { CurriculumSyllabusFormComponent } from "../../components/curriculum-syllabus-form/curriculum-syllabus-form.component";
import { SweetalertService } from '../../../../shared/service/sweetalert.service';

@Component({
  selector: 'app-add-curriculum',
  standalone: true,
  imports: [
    FormsModule,
    CurriculumSyllabusFormComponent
  ],
  templateUrl: './add-curriculum.component.html',
})
export class AddCurriculumComponent {
  capability = {
    id:'',
    ratingCode: '',
    trainingCode: '',
    trainingName: ''
  }

  regulasiGSEs: Array<{ capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string }> = [{
    capabilityId: '',
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: 'Regulasi GSE'
  }];

  kompetensis: Array<{ capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string }> = [{
    capabilityId: '',
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: 'Kompetensi'
  }];

  constructor(
    private readonly router: Router,
    private readonly curriculumSyllabusService: CurriculumSyllabusService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { id?: string, ratingCode?: string, trainingName?: string } | undefined;

    if (state) {
      this.capability.id = state.id || '';
      this.capability.ratingCode = state.ratingCode || '';
      this.capability.trainingName = state.trainingName || '';

      // Assign capabilityId to the initial dynamic inputs
      this.regulasiGSEs[0].capabilityId = this.capability.id;
      this.kompetensis[0].capabilityId = this.capability.id;
    }
  }

  onSubmit() {
    // Parse input group 1 (Regulasi GSEs) to ensure numbers are correct
    this.regulasiGSEs = this.regulasiGSEs.map(item => ({
      ...item,
      theoryDuration: Number(item.theoryDuration),  // Konversi ke number
      practiceDuration: Number(item.practiceDuration),  // Konversi ke number
    }));

    // Parse input group 2 (Kompetensis) to ensure numbers are correct
    this.kompetensis = this.kompetensis.map(item => ({
      ...item,
      theoryDuration: Number(item.theoryDuration),  // Konversi ke number
      practiceDuration: Number(item.practiceDuration),  // Konversi ke number
    }));

    // Gabungkan semua data ke dalam curriculumSyllabus
    const curriculumSyllabusData = [
      ...this.regulasiGSEs,
      ...this.kompetensis
    ];

    // Panggil service untuk mengirim data ke backend
    this.curriculumSyllabusService.createCurriculumSyllabus({ curriculumSyllabus: curriculumSyllabusData }).subscribe({
      next: (response) => {
        // Handle response
        this.sweetalertService.alert('Berhasil', response.data, 'success');
        this.router.navigateByUrl('/capability');
      },
      error: (error) => {
        // Handle error
        console.error('Error saving Curriculum & Syllabus', error);
        this.errorHandlerService.alertError(error);
      }
    });
  }
}
