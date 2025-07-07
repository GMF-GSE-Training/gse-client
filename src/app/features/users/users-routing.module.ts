import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// User Components
import { UserListComponent } from './pages/user-list/user-list.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { ProfileComponent } from './pages/profile/profile.component';

// Guards
import { AuthGuard } from '../../shared/guard/auth.guard';
import { RoleGuard } from '../../shared/guard/role.guard';
import { DataCompleteGuard } from '../../shared/guard/data-complete.guard';

const routes: Routes = [
  {
    path: '', // Base for /users
    component: UserListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor'] }
  },
  {
    path: 'add', // For /users/add
    component: AddUserComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu'] }
  },
  {
    path: ':userId/edit', // For /users/:userId/edit
    component: EditUserComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin'] }
  },
  {
    path: ':userId/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu'], tab: 'profile' }
  },
  {
    path: ':userId/account',
    component: ProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu'], tab: 'account' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
