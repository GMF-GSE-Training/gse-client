import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Certificate Components
import { DisplaysCertificateFileComponent } from './pages/displays-certificate-file/displays-certificate-file.component';
import { EditCertificateComponent } from './pages/edit-certificate/edit-certificate.component';

// Guards
import { AuthGuard } from '../../shared/guard/auth.guard';
import { RoleGuard } from '../../shared/guard/role.guard';

const routes: Routes = [
  {
    path: ':certificateId/edit', // For /certificates/:certificateId/edit
    component: EditCertificateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificateRoutingModule { }

