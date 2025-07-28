import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapabilityService } from '../../../../shared/service/capability.service';
import { CurriculumSyllabusFormComponent } from "../../components/curriculum-syllabus-form/curriculum-syllabus-form.component";

@Component({
  selector: 'app-view-curriculum-syllabus',
  standalone: true,
  imports: [
    CurriculumSyllabusFormComponent,
],
  templateUrl: './view-curriculum-syllabus.component.html',
  styleUrl: './view-curriculum-syllabus.component.css'
})
export class ViewCurriculumSyllabusComponent implements OnInit {
  capability = {
    id: '',
    ratingCode: '',
    trainingCode: '',
    trainingName: ''
  }

  regulasiGSEs: Array<{ capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string; }> = [{
    capabilityId: '',
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: '',
  }];

  kompetensis: Array<{ capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string }> = [{
    capabilityId: '',
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: '',
  }];

  editLink: string = '';
  isLoading: boolean = false;
  id = this.route.snapshot.paramMap.get('capabilityId');
  backButtonRoute: string = '/capability';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly capabilityService: CapabilityService,
    private readonly router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    console.log("STATE: ", state);
    if (state) this.backButtonRoute = state['data'];
  }

  ngOnInit(): void {
    this.getCapabilityById();
  }

  getCapabilityById(): void {
    if(this.id) {
      this.isLoading = true;
      this.editLink = `/curriculum-syllabus/${this.id}/edit`;

      this.capabilityService.getCurriculumSyllabus(this.id).subscribe({
        next: ({ data }) => {
          // Update capability data
          this.capability = {
            id: data.id,
            ratingCode: data.ratingCode,
            trainingCode: data.trainingCode,
            trainingName: data.trainingName,
          };

          // Filter and map curriculumSyllabus to regulasiGSEs and kompetensis
          this.regulasiGSEs = data.curriculumSyllabus!
            .filter(item => item.type === 'Regulasi GSE')
            .map(item => ({
              capabilityId: item.capabilityId,
              name: item.name,
              theoryDuration: item.theoryDuration,
              practiceDuration: item.practiceDuration,
              type: item.type,
            }));

          this.kompetensis = data.curriculumSyllabus!
            .filter(item => item.type === 'Kompetensi')
            .map(item => ({
              capabilityId: item.capabilityId,
              name: item.name,
              theoryDuration: item.theoryDuration,
              practiceDuration: item.practiceDuration,
              type: item.type,
            }));
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
}
