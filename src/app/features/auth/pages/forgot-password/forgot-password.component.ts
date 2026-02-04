import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/service/auth.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { EmailFormComponent } from "../../components/email-form/email-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [EmailFormComponent],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  data = {
    email: ''
  };
  errorMessage: string = '';
  hcaptchaToken: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        const errorMessage = params['error'];
        // Tampilkan alert
        this.sweetalertService.alert('Gagal', errorMessage, 'error');
        // Navigasi hanya jika parameter ada
        if (errorMessage) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { error: null },
            queryParamsHandling: 'merge',
          });
        }
      }
    });
  }

  onCaptchaVerify = (token: string) => {
    this.hcaptchaToken = token;
  };

  onCaptchaExpired = () => {
    this.hcaptchaToken = '';
  };

  onCaptchaError = (event: any) => {
    this.hcaptchaToken = '';
    this.errorMessage = 'Terjadi kesalahan pada hCaptcha. Silakan coba lagi.';
  };

  onSubmit(data: { email: string }) {
    if (!this.hcaptchaToken) {
      this.errorMessage = 'Silakan selesaikan verifikasi hCaptcha.';
      return;
    }
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.forgotPassword({
      email: data.email,
      hcaptchaToken: this.hcaptchaToken
    }).subscribe({
      next: () => {
        this.sweetalertService.alert('', 'Permintaan reset password telah diproses. Silakan cek email Anda untuk instruksi selanjutnya.', 'success');
        this.hcaptchaToken = '';
      },
      error: (error) => {
        this.errorHandlerService.alertError(error);
        this.hcaptchaToken = '';
      }
    });
  }
}
