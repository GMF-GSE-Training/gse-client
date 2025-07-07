import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import paths will need to be adjusted once components are moved
import { CapabilityListComponent } from './capability-list/capability-list.component';
import { AddCapabilityComponent } from './add-capability/add-capability.component';
import { EditCapabilityComponent } from './edit-capability/edit-capability.component';
import { ViewCurriculumSyllabusComponent } from '../curriculum-syllabus/pages/view-curriculum-syllabus/view-curriculum-syllabus.component';

import { DataCompleteGuard } from '../../shared/guard/data-complete.guard';
import { RoleGuard } from '../../shared/guard/role.guard';
import { AuthGuard } from '../../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CapabilityListComponent,
    // Note: Main route guards are handled in app.routes.ts for the parent 'capability' path
  },
  {
    path: 'add',
    component: AddCapabilityComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':capabilityId/edit',
    component: EditCapabilityComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':capabilityId/curriculum-syllabus',
    component: ViewCurriculumSyllabusComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapabilityRoutingModule { }
