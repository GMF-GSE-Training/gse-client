import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from '../../../environments/environment';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AccountVerificationComponent } from './pages/account-verification/account-verification.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NgHcaptchaModule.forRoot({
      siteKey: environment.hcaptchaSiteKey,
    }),
    // Import standalone components that are used in routes
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AccountVerificationComponent
  ]
})
export class AuthModule { }
