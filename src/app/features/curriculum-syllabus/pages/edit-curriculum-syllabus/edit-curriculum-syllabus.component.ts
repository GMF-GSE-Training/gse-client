import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapabilityService } from '../../../../shared/service/capability.service';
import { CurriculumSyllabusService } from '../../../../shared/service/curriculum-syllabus.service';
import { SweetalertService } from '../../../../shared/service/sweetaler.service';
import { CurriculumSyllabusFormComponent } from "../../components/curriculum-syllabus-form/curriculum-syllabus-form.component";

@Component({
  selector: 'app-edit-curriculum-syllabus',
  standalone: true,
  imports: [
    CurriculumSyllabusFormComponent,
],
  templateUrl: './edit-curriculum-syllabus.component.html',
  styleUrl: './edit-curriculum-syllabus.component.css'
})
export class EditCurriculumSyllabusComponent implements OnInit {
  clas: string = 'add-button delete-button';
  capability = {
    id: '',
    ratingCode: '',
    trainingCode: '',
    trainingName: ''
  }

  regulasiGSEs: Array<{ id: string; capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string; }> = [{
    id: '',
    capabilityId: '',
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: '',
  }];

  kompetensis: Array<{ id: string, capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string }> = [{
    id: '',
    capabilityId: '',
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: '',
  }];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sweetalertService: SweetalertService,
    private readonly capabilityService: CapabilityService,
    private readonly curriculumSyllabusService: CurriculumSyllabusService,
  ) { }

  capabilityId = this.route.snapshot.paramMap.get('capabilityId');
  isLoading: boolean = false;

  ngOnInit(): void {
    this.getCapabilityById();
  }

  private getCapabilityById(): void {
    if (this.capabilityId) {
      this.isLoading = true;
      this.capabilityService.getCurriculumSyllabus(this.capabilityId).subscribe({
        next: (response) => {
          if (typeof response.data === 'object') {
            const data = response.data;
            this.capability = {
              id: data.id,
              ratingCode: data.ratingCode,
              trainingCode: data.trainingCode,
              trainingName: data.trainingName,
            };

            // Mapping curriculumSyllabus to respective arrays
            this.regulasiGSEs = this.mapSyllabus(data.curriculumSyllabus!, 'Regulasi GSE');
            this.kompetensis = this.mapSyllabus(data.curriculumSyllabus!, 'Kompetensi');
          }
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  // Helper function to map syllabus
  mapSyllabus(syllabus: any[], type: string) {
    return syllabus
      .filter(item => item.type === type)
      .map(item => ({
        id: item.id,
        capabilityId: item.capabilityId,
        name: item.name,
        theoryDuration: item.theoryDuration,
        practiceDuration: item.practiceDuration,
        type: item.type,
      }));
  }

  onSubmit() {
    // Ensure `theoryDuration` and `practiceDuration` are numbers
    this.regulasiGSEs = this.regulasiGSEs.map(item => ({
      ...item,
      theoryDuration: Number(item.theoryDuration),
      practiceDuration: Number(item.practiceDuration),
    }));

    this.kompetensis = this.kompetensis.map(item => ({
      ...item,
      theoryDuration: Number(item.theoryDuration),
      practiceDuration: Number(item.practiceDuration),
    }));

    // Combine both groups into a single array
    const curriculumSyllabusData = [
      ...this.regulasiGSEs,
      ...this.kompetensis
    ];+

    // Send the data to the backend using the service
    this.curriculumSyllabusService.updateCurriculumSyllabus(this.capability.id, { curriculumSyllabus: curriculumSyllabusData }).subscribe({
      next: (response) => {
        this.sweetalertService.alert('Berhasil', response.data, 'success');
        this.router.navigateByUrl('/capability');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
