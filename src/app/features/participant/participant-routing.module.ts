import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParticipantListComponent } from './participant-list/participant-list.component';
import { AddParticipantDataComponent } from './add-participant-data/add-participant-data.component';
import { ParticipantDetailComponent } from './participant-detail/participant-detail.component';
import { EditParticipantDataComponent } from './edit-participant-data/edit-participant-data.component';
import { IdCardComponent } from './id-card/id-card.component';
import { DisplaysParticipantFilesComponent } from './displays-participants-files/displays-participant-file.component';

import { AuthGuard } from '../../shared/guard/auth.guard';
import { RoleGuard } from '../../shared/guard/role.guard';
import { DataCompleteGuard } from '../../shared/guard/data-complete.guard';

const routes: Routes = [
  {
    path: 'add',
    component: AddParticipantDataComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu'] }
  },
  {
    path: ':participantId/profile/personal',
    component: ParticipantDetailComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['user'] }
  },
  {
    path: ':participantId/profile/account',
    component: ParticipantDetailComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['user'] }
  },
  {
    path: ':participantId/edit',
    component: EditParticipantDataComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'lcu', 'user'] }
  },
  {
    path: ':participantId/id-card',
    component: IdCardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: ':participantId/sim-a',
    component: DisplaysParticipantFilesComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: ':participantId/sim-b',
    component: DisplaysParticipantFilesComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: ':participantId/ktp',
    component: DisplaysParticipantFilesComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: ':participantId/surat-sehat-buta-warna',
    component: DisplaysParticipantFilesComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: ':participantId/surat-bebas-narkoba',
    component: DisplaysParticipantFilesComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: '',
    component: ParticipantListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantRoutingModule { }
