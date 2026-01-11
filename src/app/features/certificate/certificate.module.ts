import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificateRoutingModule } from './certificate-routing.module';
import { DisplaysCertificateFileComponent } from './pages/displays-certificate-file/displays-certificate-file.component';
import { EditCertificateComponent } from './pages/edit-certificate/edit-certificate.component';

@NgModule({
  imports: [
    CommonModule,
    CertificateRoutingModule,
    // Import standalone components that are used in routes
    DisplaysCertificateFileComponent,
    EditCertificateComponent
  ]
})
export class CertificateModule { }

