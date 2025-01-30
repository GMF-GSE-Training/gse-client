import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ESignFormComponent } from "../../../contents/e-sign-form/e-sign-form.component";
import { ESignService } from '../../../shared/service/e-sign.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { UpdateESign } from '../../../shared/model/e-sign.model';

@Component({
  selector: 'app-edit-sign',
  standalone: true,
  imports: [
    ESignFormComponent
],
  templateUrl: './edit-sign.component.html',
  styleUrl: './edit-sign.component.css'
})
export class EditSignComponent implements OnInit {
  constructor(
    private readonly eSignService: ESignService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sweetalertService: SweetalertService,
    private readonly route: ActivatedRoute,
  ) { }

  eSign: UpdateESign = {
    idNumber: '',
    role: '',
    name: '',
    eSign: undefined,
    eSignFileName: undefined,
    signatureType: undefined,
    status: false,
  }

  eSignId = this.route.snapshot.paramMap.get('eSignId');

  ngOnInit(): void {
    this.getESignById();
  }

  onUpdate(eSign: UpdateESign) {
    if(this.eSignId) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      const formData = this.prepareFormData(eSign);
      this.eSignService.updateESign(this.eSignId, formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/e-sign');
          this.sweetalertService.alert('Berhasil', 'E-Sign berhasil ditambahkan', 'success');
        },
        error: (error) => {
          this.errorHandlerService.alertError(error);
        }
      });
    }
  }

  private getESignById(): void {
    if(this.eSignId) {
      this.eSignService.getESignById(this.eSignId).subscribe({
        next: ({ data }) => {
          this.eSign = data;
          console.log(this.eSign)
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  onFileChange(property: string, file: File | null): void {
    if (file) {
      (this.eSign as any)[property] = file;
      const fileNameProperty = `${property}FileName`;
      // Mengisi nama file ke property yang sesuai
      (this.eSign as any)[fileNameProperty] = file.name;
    }
  }

  private prepareFormData(eSign: any): FormData {
    const formData = new FormData();
    for (const key in eSign) {
      if (eSign.hasOwnProperty(key)) {
        let value = eSign[key];

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
}
