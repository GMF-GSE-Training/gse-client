import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../../shared/service/participant.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { DisplayFilesComponent } from "../../../shared/components/display-files/display-files.component";
import { SweetalertService } from '../../../shared/service/sweetalert.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';
import { finalize } from 'rxjs/operators';
import { WebResponse } from '../../../shared/model/web.model';
import { ParticipantResponse } from '../../../shared/model/participant.model';

@Component({
  selector: 'app-id-card',
  standalone: true,
  imports: [DisplayFilesComponent],
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.css'],
})
export class IdCardComponent implements OnInit {
  id_card: SafeHtml = '';
  id: string | null = this.route.snapshot.paramMap.get('participantId');
  navigationLink: string = `/participants/${this.id}/detail`;
  isLoading: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly participantService: ParticipantService,
    private readonly sanitizer: DomSanitizer,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getIdCard();
  }

  getIdCard(): void {
    if (!this.id) {
      this.sweetalertService.alert('Peringatan', 'ID tidak ditemukan.', 'warning');
      return;
    }

    this.isLoading = true;
    this.participantService.viewIdCard(this.id).subscribe({
      next: (response) => {
        this.id_card = this.sanitizer.bypassSecurityTrustHtml(response);
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  downloadIdCard(): void {
    if (!this.id) {
      this.sweetalertService.alert('Peringatan', 'ID tidak ditemukan.', 'warning');
      return;
    }

    this.sweetalertService.loading('Mohon tunggu', 'Proses...');

    // Ambil detail peserta untuk mendapatkan nama
    this.participantService.getParticipantById(this.id!).pipe(
      finalize(() => this.sweetalertService.close())
    ).subscribe({
      next: (response: WebResponse<ParticipantResponse>) => {
        if (response.data) {
          const participantName = response.data.name;
          const sanitizedName = participantName
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_-]/g, '');
          const filename = `ID_Card_${sanitizedName}_${this.id}.pdf`;

          // Unduh file setelah mendapatkan nama
          this.participantService.downloadIdCard(this.id!).subscribe({
            next: (blob: Blob) => {
              if (blob) {
                saveAs(blob, filename);
                console.log(`File saved as: ${filename}`);
              } else {
                this.sweetalertService.alert('Gagal!', 'Tidak ada data untuk diunduh.', 'error');
              }
            },
            error: (error) => {
              console.error('Error saat mengunduh ID Card:', error);
              this.errorHandlerService.alertError(error);
            },
          });
        } else {
          this.sweetalertService.alert('Gagal!', 'Data peserta tidak ditemukan.', 'error');
        }
      },
      error: (error) => {
        console.error('Error saat mengambil detail peserta:', error);
        this.errorHandlerService.alertError(error);
      },
    });
  }
}
