import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginUserRequest } from '../../../shared/model/auth.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/service/auth.service';
import { LoginFormComponent } from "../../../contents/login-form/login-form.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    LoginFormComponent
],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isPassVisible: boolean = false;
  loginRequest: LoginUserRequest = {
    identifier: '',
    password: '',
  };
  loginError: boolean = false;
  message: string = '';
  isLoading: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  passVisible() {
    this.isPassVisible = !this.isPassVisible;
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        this.authService.me().subscribe({
          next: (response) => {
            this.authService.setUserProfile(response.data);
            localStorage.setItem('user_profile', JSON.stringify(response.data));
            this.loginError = false;
            this.isLoading = false;
            this.router.navigateByUrl('/home');
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => {
        console.log(error)
        this.loginError = true;
        this.isLoading = false;
        if(error.status === 400) {
          this.message = 'Informasi login tidak valid. Silakan periksa kembali email atau nomor pegawai dan password Anda';
        } else if(error.status === 403) {
          this.message = 'Akun belum diverifikasi, silahkan verifikasi akun terlebih dahulu';
        } else {
          this.message = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
        }
      }
    });
  }
}
