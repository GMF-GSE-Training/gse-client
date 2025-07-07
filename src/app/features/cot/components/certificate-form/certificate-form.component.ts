import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../../../components/title/title.component";
import { BaseInputComponent } from "../../../../components/input/base-input/base-input.component";
import { WhiteButtonComponent } from "../../../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../../../components/header/header.component";

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
    HeaderComponent
],
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.css'
})
export class CertificateFormComponent {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    ) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras.state;

      // Dapatkan participantId dari parameter URL
      const participantId = this.route.snapshot.paramMap.get('participantId');

      if (state && participantId) {
        // Jika state adalah objek, gunakan Object.values untuk mencocokkan
        const matchedParticipant = Object.values(state).find(
          (item: any) => item.participantIdd === participantId
        );

        if (matchedParticipant) {
          this.backButtonRoute = matchedParticipant.link; // Atur link dari data yang cocok
          this.certificate.idNumber = matchedParticipant.idNumber;
          this.certificate.name = matchedParticipant.name;
          this.certificate.trainingName = matchedParticipant.trainingName;
          this.certificate.theoryScore = matchedParticipant.theoryScore;
          this.certificate.practiceScore = matchedParticipant.practiceScore;
        } else {
          this.backButtonRoute = '/cot'; // Default jika tidak ada yang cocok
        }
      } else {
        this.backButtonRoute = '/cot'; // Default jika state atau participantId tidak tersedia
      }
  }

  cotId = this.route.snapshot.paramMap.get('cotId');
  participantId = this.route.snapshot.paramMap.get('participantId');

  @Input() pageTitle: string = '';
  @Input() certificate: any = {};
  @Input() backButtonRoute: string = '';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() fileChange = new EventEmitter<{ property: string, file: File | null }>();

  @ViewChild('form') form!: NgForm;

  onSubmit() {
    if (this.form.valid) {
      delete this.certificate.idNumber;
      delete this.certificate.name;
      delete this.certificate.trainingName;
      this.certificate.theoryScore = Number(this.certificate.theoryScore);
      this.certificate.practiceScore = Number(this.certificate.practiceScore);
      this.formSubmit.emit(this.certificate);
    }
  }
}
