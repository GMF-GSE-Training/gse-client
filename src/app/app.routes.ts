import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { guestGuard } from './shared/guard/guest.guard';
import { RoleGuard } from './shared/guard/role.guard';
import { DataCompleteGuard } from './shared/guard/data-complete.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  // Backward compatibility for direct auth routes
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'password-reset', redirectTo: 'auth/password-reset', pathMatch: 'full' },
  { path: 'reset/:token', redirectTo: 'auth/reset/:token', pathMatch: 'full' },
  { path: 'verification', redirectTo: 'auth/verification', pathMatch: 'full' },
  { path: 'verify', redirectTo: 'auth/verify', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'participants/:participantId/detail',
    loadComponent: () => import('./features/participant/participant-detail/participant-detail.component').then(m => m.ParticipantDetailComponent),
  },
  {
    path: 'participants',
    loadChildren: () => import('./features/participant/participant.module').then(m => m.ParticipantModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'capability',
    loadChildren: () => import('./features/capability/capability.module').then(m => m.CapabilityModule),
    canActivate: [AuthGuard, RoleGuard, DataCompleteGuard],
    data: { roles: ['super admin', 'supervisor', 'lcu', 'user'] }
  },
  {
    path: 'cot',
    loadChildren: () => import('./features/cot/cot.module').then(m => m.CotModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'e-sign',
    loadChildren: () => import('./features/e-sign/e-sign.module').then(m => m.ESignModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'curriculum-syllabus',
    loadChildren: () => import('./features/curriculum-syllabus/curriculum-syllabus.module').then(m => m.CurriculumSyllabusModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'certificates',
    loadChildren: () => import('./features/certificate/certificate.module').then(m => m.CertificateModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'not-found',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
