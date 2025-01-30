import { Component, OnInit } from '@angular/core';
import { VerticalTableComponent } from "../../../components/vertical-table/vertical-table.component";
import { EmailFormCardComponent } from "../../../components/card/email-form-card/email-form-card.component";
import { PasswordUpdateFormCardComponent } from "../../../components/card/password-update-form-card/password-update-form-card.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../shared/model/user.model';
import { AuthService } from '../../../shared/service/auth.service';
import { SweetalertService } from '../../../shared/service/sweetaler.service';
import { UpdatePassword } from '../../../shared/model/auth.model';
import { ErrorHandlerService } from '../../../shared/service/error-handler.service';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    VerticalTableComponent,
    EmailFormCardComponent,
    PasswordUpdateFormCardComponent,
    CommonModule,
    RouterLink,
    HeaderComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  selectedItem: number = 0;
  userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  id = this.route.snapshot.paramMap.get('id') || this.userProfile.id;
  user: User | null = null;
  verticalTableData: any[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sweetalertService: SweetalertService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) { }

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
      } else if (params['success']) {
        const successMessage = params['success'];
        // Tampilkan alert
        this.sweetalertService.alert('Berhasil', successMessage, 'success');
        this.getProfile();
        // Navigasi hanya jika parameter ada
        if (successMessage) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { success: null },
            queryParamsHandling: 'merge',
          });
        }
      }
    });

    this.route.url.subscribe(urlSegments => {
      const url = urlSegments.map(segment => segment.path).join('/');
      if (url === `users/${this.id}/personal`) {
        this.selectedItem = 0;
      } else if (url === `users/${this.id}/account`) {
        this.selectedItem = 1;
      }
    });

    this.getUserFromLocalStorage();
  }

  private getUserFromLocalStorage() {
    this.user = this.userProfile;
    const participant = this.userProfile;
    if (participant) {
      this.setParticipantData(participant);
    }
  }

  private getProfile(): void {
    this.authService.me().subscribe({
      next: (response) => {
        localStorage.setItem('user_profile', JSON.stringify(response.data));
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateEmailSubmit(data: { email: string }): void{
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.updateEmailRequest(data).subscribe({
      next: () => {
        this.sweetalertService.alert(
          'Berhasil',
          `Kami telah mengirimkan email berisi tautan verifikasi ke email baru Anda (${data.email}). Silahkan buka tautan verifikasi untuk menyelesaikan proses ini`,
          'success'
        );
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.alertError(error);
      }
    });
  }

  updatePasswordSubmit(data: UpdatePassword): void{
    this.sweetalertService.loading('Mohon tunggu', 'Proses...');
    this.authService.updatePassword(data).subscribe({
      next: () => {
        this.sweetalertService.alert(
          'Berhasil',
          'Password berhadil diubah',
          'success');
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.alertError(error);
      }
    });
  }

  private setParticipantData(user: User) {
    this.user = user;

    this.verticalTableData = [
      { label: 'No Pegawai', value: this.user.idNumber },
      { label: 'Nama', value: this.user.name },
      { label: 'Dinas', value: this.user.dinas ?? '-' },
      { label: 'Email', value: this.user.email },
      { label: 'Role', value: this.user.role.name },
    ];
  }
}
