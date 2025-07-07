import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Auth Components (now in ./pages/)
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AccountVerificationComponent } from './pages/account-verification/account-verification.component';
import { VerificationComponent } from './pages/verification/verification.component';

// Guards
import { guestGuard } from '../../shared/guard/guest.guard'; // Path relative to this file

const routes: Routes = [
  {
    path: 'login', // Will map to /login or /auth/login depending on app.routes.ts
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register', // Will map to /register or /auth/register
    component: RegisterComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'password-reset', // Will map to /password-reset or /auth/password-reset
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset/:token', // Will map to /reset/:token or /auth/reset/:token
    component: ResetPasswordComponent,
  },
  {
    path: 'verification', // Will map to /verification or /auth/verification
    component: AccountVerificationComponent,
  },
  {
    path: 'verify', // Untuk verifikasi dengan token di query params
    component: AccountVerificationComponent,
  },
  {
    path: 'verified', // Untuk landing page setelah redirect verifikasi email
    component: VerificationComponent,
  },
  // Default route for auth feature
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
