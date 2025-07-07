import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from '../../shared/guard/auth.guard';
import { RoleGuard } from '../../shared/guard/role.guard';
import { DataCompleteGuard } from '../../shared/guard/data-complete.guard';

const routes: Routes = [
  {
    path: '', // This will be the base path for the dashboard feature (e.g., /dashboard)
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] } // Keep the roles data
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
