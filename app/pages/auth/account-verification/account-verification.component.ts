import { Component, OnInit } from '@angular/core';
import { EmailFormComponent } from "../../../contents/email-form/email-form.component";
import { AuthService } from '../../../shared/service/auth.service';
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [EmailFormComponent],
  templateUrl: './account-verification.component.html',
  styleUrl: './account-verification.component.css'
})
export class AccountVerificationComponent implements OnInit {
  data = {
    email: ''
  };
  message: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit() {
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

  onSubmit(data: { email: string }) {
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.resendVerification(data).subscribe({
      next: () => {
        this.sweetalertService.alert('', 'Bila email ada, maka email untuk mengubah password akan dikirim ke email yang Anda masukkan', 'success');
      },
      error: (error) => {
        this.errorHandlerService.alertError(error);
        console.log(error);
      }
    });
  }
}
