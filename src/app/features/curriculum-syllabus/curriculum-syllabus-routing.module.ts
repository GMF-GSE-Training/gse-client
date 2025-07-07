import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AddCurriculumComponent } from './pages/add-curriculum/add-curriculum.component';
import { EditCurriculumSyllabusComponent } from './pages/edit-curriculum-syllabus/edit-curriculum-syllabus.component';
import { ViewCurriculumSyllabusComponent } from './pages/view-curriculum-syllabus/view-curriculum-syllabus.component';

// Guards
import { AuthGuard } from '../../shared/guard/auth.guard';
import { RoleGuard } from '../../shared/guard/role.guard';
// import { DataCompleteGuard } from '../../shared/guard/data-complete.guard'; // Assuming not needed for all these routes based on app.routes.ts

const routes: Routes = [
  {
    path: 'add', // Corresponds to /curriculum-syllabus/add
    component: AddCurriculumComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':capabilityId/edit', // Corresponds to /curriculum-syllabus/:capabilityId/edit
    component: EditCurriculumSyllabusComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    // Note: app.routes.ts did not have a direct route for ViewCurriculumSyllabusComponent.
    // Adding a placeholder route here. This might need adjustment based on actual usage.
    // For example, if it's a detail view, it might be under a specific ID.
    // Let's assume a base path for viewing, perhaps by capabilityId or as a list.
    // For now, let's make a generic view path, e.g., ':capabilityId/view'
    path: ':capabilityId/view', 
    component: ViewCurriculumSyllabusComponent,
    canActivate: [AuthGuard, RoleGuard], // Add appropriate guards
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] } // Add appropriate roles
  },
  // Default route for curriculum-syllabus
  {
    path: '',
    component: ViewCurriculumSyllabusComponent, // Using view component as default since there's no list component
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurriculumSyllabusRoutingModule { }
