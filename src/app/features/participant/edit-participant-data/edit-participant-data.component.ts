import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateParticipant } from '../../../shared/model/participant.model';
import { ParticipantService } from '../../../shared/service/participant.service';
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { CompanyInputComponent } from '../../../components/input/company-input/company-input.component';
import { ParticipantFormComponent } from '../components/participant-form/participant-form.component';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';

@Component({
  selector: 'app-edit-participant-data',
  standalone: true,
  imports: [
    ParticipantFormComponent,
],
  templateUrl: './edit-participant-data.component.html',
})
export class EditParticipantDataComponent implements OnInit {
  @ViewChild(CompanyInputComponent) companyInputComponent!: CompanyInputComponent;

  updateParticipant: UpdateParticipant = {
    idNumber: '',
    name: '',
    nik: '',
    dinas: '',
    bidang: '',
    company: '',
    phoneNumber: '',
    nationality: '',
    placeOfBirth: '',
    dateOfBirth: '',
    simA: null,
    simAFileName: '',
    simB: null,
    simBFileName: '',
    ktp: null,
    ktpFileName: '',
    foto: null,
    fotoFileName: '',
    suratSehatButaWarna: null,
    suratSehatButaWarnaFileName: '',
    suratBebasNarkoba: null,
    suratBebasNarkobaFileName: '',
    tglKeluarSuratSehatButaWarna: null,
    tglKeluarSuratBebasNarkoba: null,
  };

  participantId = this.route.snapshot.paramMap.get('participantId');
  isLoading = false;

  // Company Input
  @Input() selectedCompany: string = '';
  @Input() companyName: string = '';
  @Input() showCompanyInput: boolean = false;

  private requiredFields = ['name', 'company', 'email', 'phoneNumber', 'kewarganegaraan',
                    'placeOfBirth', 'dateOfBirth', 'simA', 'ktp', 'foto',
                    'suratSehatButaWarna', 'tglKeluarSuratSehatButaWarna',
                    'suratBebasNarkoba', 'tglKeluarSuratSehatBebasNarkoba'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly participantService: ParticipantService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
  }

  userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  id = this.route.snapshot.paramMap.get('participantId') || this.userProfile.participant.id;
  backButtonRoute: string = '/participants';

  ngOnInit(): void {
    if(this.participantId && this.userProfile !== '{}') {
      if(this.userProfile.role === 'user') {
        this.getParticipantFromLocalStorage();
      } else {
        this.getParticipantById();
      }
    }
    this.route.queryParams.subscribe(params => {
      if (params['showAlert']) {
        this.sweetalertService.alert(
          'Peringatan',
          'Anda tidak bisa mengakses halaman lain sebelum melengkapi data',
          'warning'
        );

        // Hapus query parameter
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { showAlert: null },
          queryParamsHandling: 'merge'
        });
      }
    });

    if(this.id && (this.userProfile.role.name === 'user')) {
      this.backButtonRoute = `/participants/${this.id}/profile/personal`;
    }
  }

  getParticipantFromLocalStorage(): void {
    const participantData = this.userProfile.participant;
    if (participantData) {
      this.isLoading = true;
      this.setParticipantData(participantData);
      this.isLoading = false;
    }
  }

  getParticipantById(): void {
    if (this.participantId) {
      this.isLoading = true;
      this.participantService.getParticipantById(this.participantId).subscribe({
        next: (response) => {
          const responseData = response.data;
          if (responseData) {
            this.setParticipantData(responseData);
          }
        },
        error: (error) => console.log(error),
        complete: () => this.isLoading = false
      });
    }
  }

  onUpdate(participant: UpdateParticipant) {
    if(this.participantId) {
      const formData = this.prepareFormData(participant);
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');

      this.participantService.updateParticipant(this.participantId, formData).subscribe({
        next: () => {
          this.sweetalertService.alert('Diperbarui!', 'Peserta berhasil diperbarui', 'success');
          const participantData = this.userProfile.participant;
          if(participantData) {
            const participantEmail = participantData.email;
            this.userProfile.participant = JSON.parse(
              JSON.stringify(participant, (_key, value) =>
                  value instanceof File || value === null ? undefined : value
              )
            );
            this.userProfile.participant.email = participantEmail;
            this.userProfile.isDataComplete = true;
            // participantData.gmfNonGmf = participantData.company.includes('gmf') || participantData.company.includes('garuda maintenance facility') ? 'GMF' : 'Non GMF';
            localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
          }

          if((this.userProfile.role.name === 'user')) {
            localStorage.removeItem('pas_foto');
            localStorage.removeItem('qr_code');
            this.router.navigateByUrl(`/participants/${this.participantId}/profile/personal`);
          } else {
            this.router.navigateByUrl(`/participants/${this.participantId}/detail`);
          }
        },
        error: (error) => {
          console.log(error);
          this.errorHandlerService.alertError(error, this.requiredFields);
        }
      });
    }
  }

  onFileChange(property: string, file: File | null): void {
    if (file) {
      (this.updateParticipant as any)[property] = file;
      const fileNameProperty = `${property}FileName`;
      // Mengisi name file ke property yang sesuai
      (this.updateParticipant as any)[fileNameProperty] = file.name;
    }
  }

  private setParticipantData(responseData: any): void {
    this.updateParticipant = {
      ...responseData,
      dateOfBirth: this.formatDateToISO(responseData.dateOfBirth),
      tglKeluarSuratSehatButaWarna: this.formatDateToISO(responseData.tglKeluarSuratSehatButaWarna),
      tglKeluarSuratBebasNarkoba: this.formatDateToISO(responseData.tglKeluarSuratBebasNarkoba),
    };

    this.selectedCompany = responseData.gmfNonGmf ? responseData.gmfNonGmf : responseData.company;

    if (responseData.gmfNonGmf !== 'GMF' || responseData.company !== 'GMF') {
      this.companyName = responseData.company;
      this.showCompanyInput = !!this.companyName;
      if (!this.companyName) {
        this.selectedCompany = 'GMF';
        this.companyName = 'GMF';
        this.showCompanyInput = false;
      }
    }
  }

  private prepareFormData(participant: any): FormData {
    const formData = new FormData();
    for (const key in participant) {
      if (participant.hasOwnProperty(key)) {
        let value = participant[key];

        if(value === undefined || value === null) {
          value = '';
        }

        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
    }
    return formData;
  }


  private formatDateToISO(dateString: string): string {
    const date = new Date(dateString); // Konversi string menjadi objek Date
    return date.toISOString().split('T')[0]; // Ambil hanya bagian tanggal (yyyy-MM-dd)
  }
}
