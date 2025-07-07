import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COT Components (now in ./pages/)
import { AddCotComponent } from './pages/add-cot/add-cot.component';
import { CotListComponent } from './pages/cot-list/cot-list.component';
import { EditCotComponent } from './pages/edit-cot/edit-cot.component';
import { CotDetailComponent } from './pages/cot-detail/cot-detail.component';
import { CreateCertificateComponent } from './pages/create-certificate/create-certificate.component';

// Guards
import { AuthGuard } from '../../shared/guard/auth.guard';
import { RoleGuard } from '../../shared/guard/role.guard';
import { DataCompleteGuard } from '../../shared/guard/data-complete.guard';

const routes: Routes = [
  {
    path: '', // Base for /cot
    component: CotListComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: 'add', // For /cot/add
    component: AddCotComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':cotId/edit', // For /cot/:cotId/edit
    component: EditCotComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':cotId/detail', // For /cot/:cotId/detail
    component: CotDetailComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    // Note: This route was 'certificate/:cotId/create/:participantId'
    // To keep it under the 'cot' base path, we might adjust it or handle 'certificate' as a separate feature module.
    // For now, let's assume it stays related and becomes 'cot/certificate/:cotId/create/:participantId'
    // or if we want to keep the URL structure, this might need to be a top-level lazy loaded module itself.
    // Given the current structure, let's map it within COT.
    path: 'certificate/:cotId/create/:participantId', // Will become /cot/certificate/:cotId/create/:participantId
    component: CreateCertificateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotRoutingModule { }
