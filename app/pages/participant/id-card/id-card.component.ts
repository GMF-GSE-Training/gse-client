import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../../shared/service/participant.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { DisplayFilesComponent } from "../../../contents/display-files/display-files.component";
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';

@Component({
  selector: 'app-id-card',
  standalone: true,
  imports: [
    DisplayFilesComponent
],
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.css'],
})
export class IdCardComponent implements OnInit {
  id_card: SafeHtml = '';
  id = this.route.snapshot.paramMap.get('participantId');
  navigationLink: string = `/participants/${this.id}/detail`;
  isLoading: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly participantService: ParticipantService,
    private readonly sanitizer: DomSanitizer,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ){}

  ngOnInit(): void {
    this.getIdCard();
  }

  getIdCard(): void {
    this.isLoading = true;
    this.participantService.viewIdCard(this.id!).subscribe({
      next: (response) => {
        this.id_card = this.sanitizer.bypassSecurityTrustHtml(response);
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

  downloadIdCard() {
    if (this.id) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.participantService.downloadIdCard(this.id).subscribe({
        next: (response) => {
          saveAs(response);
          this.sweetalertService.close();
        },
        error: (error) => {
          console.log(error);
          this.errorHandlerService.alertError(error);
        }
      });
    }
  }
}
