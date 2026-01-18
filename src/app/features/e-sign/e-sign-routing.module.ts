import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// E-Sign Components
import { AddSignComponent } from './pages/add-sign/add-sign.component';
import { SignatureListComponent } from './pages/signature-list/signature-list.component';
import { EditSignComponent } from './pages/edit-sign/edit-sign.component';
import { DisplaysSignatureFileComponent } from './pages/displays-signature-file/displays-signature-file.component';

// Guards
import { AuthGuard } from '../../shared/guard/auth.guard';
import { RoleGuard } from '../../shared/guard/role.guard';
import { DataCompleteGuard } from '../../shared/guard/data-complete.guard';

const routes: Routes = [
  {
    path: '', // Base for /e-sign
    component: SignatureListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor'] }
  },
  {
    path: 'add', // For /e-sign/add
    component: AddSignComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':eSignId/edit', // For /e-sign/:eSignId/edit
    component: EditSignComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':eSignId/view', // For /e-sign/:eSignId/view
    component: DisplaysSignatureFileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ESignRoutingModule { }
