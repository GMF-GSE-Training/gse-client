import { Component } from '@angular/core';
import { RegisterUserRequest } from '../../../../shared/model/auth.model';
import { AuthService } from '../../../../shared/service/auth.service';
import { UserFormComponent } from '../../../users/components/user-form/user-form.component';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    UserFormComponent
],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerUserRequest: RegisterUserRequest = {
    idNumber: '',
    nik: '',
    email: '',
    name: '',
    password: '',
    dinas: '',
  };

  isSuccess: boolean = false;
  registerMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly handleErrorService: ErrorHandlerService,
    private router: Router
  ){ }

  onRegister(user: RegisterUserRequest) {
    this.cleanEmptyFields(user);
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.register(user).subscribe({
      next: () => {
        this.sweetalertService.close();
        this.isSuccess = true;
        this.sweetalertService.alert(
          'Berhasil', 
          'Registrasi berhasil. Silakan login, dan cek email (inbox/spam) untuk verifikasi akun.', 
          'success'
        ).then(() => this.router.navigateByUrl('/auth/login'));
      },
      error: (error) => {
        console.log(error);
        this.sweetalertService.close();
        this.isSuccess = false;
        this.registerMessage = this.handleErrorService.getErrorMessage(error, ['nik', 'email', 'nama', 'password']);
      },
    });
  }

  private cleanEmptyFields(object: any): void {
    for (const key in object) {
      if (object.hasOwnProperty(key) && object[key] === '') {
        object[key] = undefined;  // Atau bisa diubah menjadi undefined
      }
    }
  }

  register() {
    this.isLoading = true;
    this.authService.register(this.registerUserRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.sweetalertService.alert(
          'Berhasil',
          'Registrasi berhasil. Tautan verifikasi telah dikirim ke email Anda. Periksa kotak masuk/spam.',
          'success'
        ).then(() => this.router.navigateByUrl('/auth/login'));
      },
      error: (error) => {
        this.sweetalertService.close();
        console.log(error);
        if (error.status === 503) {
          this.isLoading = false;
          this.sweetalertService.alert(
            'Peringatan',
            'Akun Anda sudah terdaftar, namun sistem gagal mengirim email verifikasi. Silakan verifikasi akun Anda di menu "Belum Terverifikasi?".',
            'warning'
          ).then(() => this.router.navigateByUrl('/auth/verification'));
          return;
        }
        
        this.isLoading = false;
        this.handleErrorService.alertError(error);
      }
    });
  }
}
