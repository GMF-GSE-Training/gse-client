import { Component, OnInit } from '@angular/core';
import { EmailFormComponent } from "../../components/email-form/email-form.component";
import { AuthService } from '../../../../shared/service/auth.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertResult } from 'sweetalert2';
import { tap } from 'rxjs/operators';

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
  errorMessage: string = '';
  hcaptchaToken: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    // Cek jika ada token di URL (berarti user mengklik link verifikasi dari email)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Proses verifikasi token
        this.verifyAccount(token);
      }
      
      // Cek jika ada email di sessionStorage (dari login redirect)
      const storedEmail = sessionStorage.getItem('unverified_email');
      if (storedEmail) {
        this.data.email = storedEmail;
        // Hapus dari sessionStorage setelah digunakan
        sessionStorage.removeItem('unverified_email');
      }
    });
  }

  onSubmit(data: { email: string }): void {
    // reset error
    this.errorMessage = '';

    // validasi captcha
    if (!this.hcaptchaToken) {
      this.errorMessage = 'Silakan selesaikan verifikasi hCaptcha.';
      return;
    }
    
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.resendVerification(data.email).subscribe({
      next: () => {
        this.sweetalertService.close();
        this.sweetalertService.alert(
          'Berhasil', 
          'Tautan verifikasi telah dikirim ke email Anda. Periksa kotak masuk/spam.', 
          'success'
        );
        // reset token
        this.hcaptchaToken = '';
      },
      error: (error) => {
        this.sweetalertService.close();
        this.errorMessage = error?.error?.errors || 'Terjadi kesalahan. Coba lagi.';
        this.hcaptchaToken = '';
      }
    });
  }

  onCaptchaVerify(token: string): void {
    console.log('✅ Captcha verified, token:', token.substring(0, 20) + '...');
    this.hcaptchaToken = token;
  }

  onCaptchaExpired(): void {
    console.warn('⚠️ Captcha expired');
    this.hcaptchaToken = '';
  }

  onCaptchaError(event: any): void {
    console.error('❌ Captcha error:', event);
    this.hcaptchaToken = '';
    this.errorMessage = 'Terjadi kesalahan pada hCaptcha. Silakan coba lagi.';
  }
  
  
  // Metode untuk memverifikasi akun dengan token dari URL
  private verifyAccount(token: string) {
    this.sweetalertService.loading('Mohon tunggu', 'Memverifikasi akun Anda...');
    this.authService.verifyAccount(token).subscribe({
      next: (response) => {
        this.sweetalertService.close();
        this.sweetalertService.alert(
          'Verifikasi Berhasil', 
          'Akun berhasil diverifikasi. Mengarahkan ke Dashboard...', 
          'success'
        ).then(() => {
          // Ambil profil terbaru agar localStorage ter-update dan AuthGuard tidak mengira akun belum diverifikasi
          this.authService.me().pipe(
            tap(response => {
              // Pastikan profil pengguna diatur di localStorage setelah berhasil diverifikasi
              this.authService.setUserProfile(response.data);
            })
          ).subscribe({
            complete: () => {
              this.router.navigateByUrl('/dashboard');
            },
            error: (err) => {
              this.router.navigateByUrl('/dashboard'); // tetap arahkan meski gagal mengambil profil, karena akun sudah diverifikasi
            },
          });
        });
      },
      error: (error) => {
        this.sweetalertService.close();
        
        // Pesan khusus untuk token kadaluarsa atau tidak valid
        if (error.status === 400 && error.error?.message?.includes('Token tidak valid atau telah kadaluarsa')) {
          this.sweetalertService.alert(
            'Verifikasi Gagal', 
            'Tautan verifikasi tidak valid/kadaluarsa. Minta tautan baru di bawah.', 
            'error'
          );
        } else {
          this.errorHandlerService.alertError(error);
        }
      }
    });
  }
}
