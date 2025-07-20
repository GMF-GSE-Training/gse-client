import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUserRequest, User } from '../../../../shared/model/user.model';
import { UserService } from '../../../../shared/service/user.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { UserFormComponent } from "../../components/user-form/user-form.component";
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    UserFormComponent
],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  updateUser: UpdateUserRequest = {
    idNumber: '',
    nik: '',
    email: '',
    name: '',
    password: '',
    roleId: ''
  }

  userId = this.route.snapshot.paramMap.get('userId');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sweetalertService: SweetalertService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.get(this.userId!).subscribe({
      next: ({ data }) => {
        this.updateUser = {
          ...data,
        }
      },
      error: (error) => console.log(error),
    });
  }

  onUpdate(user: UpdateUserRequest): void {
    this.cleanEmptyFields(user);

    if(this.userId) {
      this.sweetalertService.loading('Mohon tunggu', 'Proses...');
      this.userService.updateUser(this.userId!, user).subscribe({
        next: () => {
          this.sweetalertService.alert('Ditambahkan!', 'Pengguna berhasil diperbarui', 'success');
          this.router.navigateByUrl('/users');
        },
        error: (error) => {
          console.log(error);
          this.errorHandlerService.alertError(error);
        }
      });
    }
  }

  private cleanEmptyFields(object: any): void {
    for (const key in object) {
      if (object.hasOwnProperty(key) && object[key] === '') {
        object[key] = null;  // Atau bisa diubah menjadi undefined
      }
    }
  }
}
