import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../../../components/title/title.component";
import { BaseInputComponent } from "../../../../components/input/base-input/base-input.component";
import { WhiteButtonComponent } from "../../../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../../../components/header/header.component";
import { ParticipantService } from '../../../../shared/service/participant.service';
import { CotService } from '../../../../shared/service/cot.service';
import { LoaderComponent } from "../../../../components/loader/loader.component";

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  imports: [
    TitleComponent,
    BaseInputComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    FormsModule,
    RouterLink,
    HeaderComponent,
    LoaderComponent
],
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.css'
})
export class CertificateFormComponent implements OnInit {
  cotId = this.route.snapshot.paramMap.get('cotId');
  participantId = this.route.snapshot.paramMap.get('participantId');
  private loadingCount = 0;

  @Input() pageTitle: string = '';
  @Input() certificate: any = {};
  @Input() backButtonRoute: string = '';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() fileChange = new EventEmitter<{ property: string, file: File | null }>();

  @ViewChild('form') form!: NgForm;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly participantService: ParticipantService,
    private readonly cotService: CotService,
    ) { }

  get isLoading(): boolean {
    return this.loadingCount > 0;
  }

  ngOnInit(): void {
    this.getParticipantData();
    this.getTrainingData();
    this.setBackButtonRoute();
  }

  private setBackButtonRoute(): void {
    if(this.cotId) {
      this.backButtonRoute = `/cot/${this.cotId}/detail`;
    } else {
      this.backButtonRoute = '/cot';
    }
  }

  getParticipantData(): void {
    if(this.participantId) {
      this.loadingCount++; // Increment loading counter
      this.participantService.getParticipantById(this.participantId).subscribe({
        next: ({ data }) => {
          this.certificate.idNumber = data.idNumber;
          this.certificate.name = data.name;
        },
        error: (error) => {
          console.error('Error fetching participant data:', error);
          this.loadingCount--; // Decrement on error
        },
        complete: () => {
          this.loadingCount--; // Decrement when complete
        }
      });
    }
  }

  getTrainingData(): void {
    if(this.cotId) {
      this.loadingCount++; // Increment loading counter
      this.cotService.getCotById(this.cotId).subscribe({
        next: ({ data }) => {
          this.certificate.trainingName = data.capability.trainingName;
        },
        error: (error) => {
          console.error('Error fetching training data:', error);
          this.loadingCount--; // Decrement on error
        },
        complete: () => {
          this.loadingCount--; // Decrement when complete
        }
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      delete this.certificate.idNumber;
      delete this.certificate.name;
      delete this.certificate.trainingName;
      this.certificate.theoryScore = Number(this.certificate.theoryScore);
      this.certificate.practiceScore = Number(this.certificate.practiceScore);
      this.certificate.certificateNumber = this.certificate.certificateNumber;
      this.formSubmit.emit(this.certificate);
    }
  }
}
