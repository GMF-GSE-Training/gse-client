import { Component } from '@angular/core';
import { RegisterUserRequest } from '../../../shared/model/auth.model';
import { AuthService } from '../../../shared/service/auth.service';
import { UserFormComponent } from '../../../contents/user-form/user-form.component';
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    UserFormComponent,
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

  constructor(
    private authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly handleErrorService: ErrorHandlerService,
  ){ }

  onRegister(user: RegisterUserRequest) {
    this.cleanEmptyFields(user);
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.register(user).subscribe({
      next: () => {
        this.sweetalertService.close();
        this.isSuccess = true;
        this.sweetalertService.alert('Berhasil', 'Register berhasil, link verifikasi akan dikirm ke-email anda', 'success');
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
}
