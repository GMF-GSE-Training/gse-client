import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginUserRequest } from '../../../../shared/model/auth.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../shared/service/auth.service';
import { LoginFormComponent } from "../../components/login-form/login-form.component";
import { SweetalertService } from '../../../../shared/service/sweetaler.service';

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
    private readonly sweetalertService: SweetalertService,
  ) { }

  passVisible() {
    this.isPassVisible = !this.isPassVisible;
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.loginRequest).subscribe({
          next: (response) => {
            const userData = response.data;
            this.loginError = false;
            this.isLoading = false;
            
            // Cek kelengkapan data untuk role 'user'
        if (userData && userData.role?.name === 'user' && userData.participant) {
              const participant = userData.participant;
              // Cek apakah data participant lengkap
              const isDataComplete = participant && 
                participant.dateOfBirth && 
                participant.placeOfBirth && 
                participant.phoneNumber;
                
              if (!isDataComplete) {
                this.sweetalertService.alert(
                  'Peringatan', 
                  'Data anda belum lengkap, silahkan lengkapi data terlebih dahulu', 
                  'warning'
                );
                this.router.navigate(['/participants', participant.id, 'edit']);
                return;
              }
            }
            
            // Jika semua pengecekan berhasil, arahkan ke dashboard
            this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.log(error)
        this.loginError = true;
        this.isLoading = false;
        if(error.status === 404) {
          this.message = 'Akun Anda belum terdaftar. Silakan lakukan pendaftaran untuk mengakses layanan.';
        } else if(error.status === 400) {
          this.message = 'Kata sandi yang Anda masukkan salah.';
        } else if(error.status === 403) {
          this.message = 'Akun Anda belum terverifikasi. Silakan klik menu "Belum Terverifikasi?" untuk mengirim ulang email verifikasi.';
          // Mengomentari bagian ini karena backend sudah diverifikasi dengan benar
          // this.sweetalertService.alert(
          //   'Peringatan', 
          //   'Email belum diverifikasi. Silakan verifikasi akun Anda.', 
          //   'warning'
          // ).then(() => this.router.navigateByUrl('/auth/verification'));
        } else {
          this.message = 'Server sedang sibuk atau terjadi gangguan. Silakan coba beberapa saat lagi.';
        }
      }
    });
  }
}
