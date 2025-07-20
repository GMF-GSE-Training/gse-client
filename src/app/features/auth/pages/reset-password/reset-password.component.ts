import { Component } from '@angular/core';
import { UpdatePassword } from '../../../../shared/model/auth.model';
import { AuthService } from '../../../../shared/service/auth.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordFormComponent } from "../../components/reset-password-form/reset-password-form.component";
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ResetPasswordFormComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  data = {
    token: this.route.snapshot.paramMap.get('token') || '',
    newPassword: '',
    confirmNewPassword: '',
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) { }

  onResetPassword(newPassword: UpdatePassword) {
    this.authService.resetPassword(newPassword).subscribe({
      next: () => {
        this.sweetalertService.alert('Berhasil!', 'Password berhasil diperbarui', 'success');
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.log(error)
        console.log(error);
        this.errorHandlerService.alertError(error);
      }
    })
  }
}
