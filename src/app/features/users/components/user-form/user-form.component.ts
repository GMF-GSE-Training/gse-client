import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../../../components/title/title.component";
import { BaseInputComponent } from "../../../../components/input/base-input/base-input.component";
import { WhiteButtonComponent } from "../../../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthComponent } from "../../../../components/auth/auth.component";
import { DropdownInputComponent } from "../../../../components/input/dropdown-input/dropdown-input.component";
import { RoleService } from '../../../../shared/service/role.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    RouterLink,
    TitleComponent,
    BaseInputComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    FormsModule,
    CommonModule,
    AuthComponent,
    DropdownInputComponent
],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() user: any = {};
  @Input() isRegister: boolean = false;
  @Input() isResetPassword: boolean = false;
  @Input() blueButtonLabel: string = 'Simpan';
  @Input() isCreate: boolean = false;
  @Input() registerMessage: string = '';
  @Input() isSuccess: boolean = false;

  // role-input
  roleOptions: { label: string, value: string }[] = [];
  roleData: any[] = []; // Store the full training data
  selectedRole: string = '';
  @Input() initialRole: string = '';

  isPassVisible: boolean = false;
  passVisible() {
    this.isPassVisible = !this.isPassVisible;
  }

  isConfirmPassVisible: boolean = false;
  confirmPassVisible() {
    this.isConfirmPassVisible = !this.isConfirmPassVisible;
  }

  passwordMismatch: boolean = false;
  mismatchErrorMessage: string = "";
  checkPasswordMatch() {
    if (this.user.password && this.user.confirmPassword) {
      this.passwordMismatch = this.user.password !== this.user.confirmPassword;
      if (this.passwordMismatch) {
        this.mismatchErrorMessage = 'Password tidak sama';
      } else {
        this.mismatchErrorMessage = '';
      }
    }
  }

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

  cachedCurrentUser = localStorage.getItem('user_profile');;
  currentUser: any;
  currentUserRole: string = '';

  constructor(
    private readonly roleService: RoleService,
  ) {}

  ngOnInit(): void {
    if(this.cachedCurrentUser) {
      this.currentUser = JSON.parse(this.cachedCurrentUser);
      this.currentUserRole = this.currentUser.role.name
      this.roleService.getAllRoles().subscribe({
        next: (response: { data: { id: string, name: string }[] }) => {
          this.roleData = response.data;
          this.roleOptions = response.data.map((role: { id: string, name: string }) => ({
            label: role.name,
            value: role.id
          }));
          
          // Inisialisasi selectedRole dari initialRole saat edit
          if (this.initialRole && !this.isRegister) {
            const role = this.roleData.find(r => r.id === this.initialRole);
            if (role) {
              this.selectedRole = role.name;
              this.user.roleId = role.id;
            }
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  onSubmit() {
    if (this.isFormValidForSubmit()) {
      if(this.isCreate) {
        this.formSubmit.emit(this.user);
      } else {
        if(this.currentUserRole !== 'super admin') {
          this.user.email = undefined;
        }
        this.formSubmit.emit(this.user);
      }
    }
  }

  onRoleSelected(roleId: any) {
    this.selectedRole = this.roleData.find(r => r.id === roleId).name;
    this.user.roleId = roleId;
    if(this.selectedRole !== 'user') {
      this.user.nik = null;
    }
  }

  isFormValidForSubmit(): boolean {
    if (!this.form) {
      return false;
    }

    // Untuk mode register/create, gunakan validasi form standar
    if (this.isRegister || this.isCreate) {
      return !!this.form.valid && !this.passwordMismatch;
    }

    // Untuk mode edit, validasi manual
    // Field yang selalu required
    const isNameValid = this.user.name && this.user.name.trim() !== '';
    const isRoleSelected = this.user.roleId && this.user.roleId.trim() !== '';

    // Email hanya required jika super admin (karena non-super admin tidak bisa edit email)
    let isEmailValid = true;
    if (this.currentUserRole === 'super admin') {
      isEmailValid = this.user.email && this.user.email.trim() !== '';
    }

    // Field NIK hanya required jika role adalah 'user'
    let isNikValid = true;
    if (this.selectedRole === 'user') {
      isNikValid = this.user.nik && this.user.nik.trim() !== '';
    }

    // Password hanya required jika diisi (untuk update password)
    let isPasswordValid = true;
    if (this.user.password || this.user.confirmPassword) {
      isPasswordValid = 
        this.user.password && 
        this.user.password.length >= 8 &&
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/.test(this.user.password) &&
        !this.passwordMismatch;
    }

    return isNameValid && isEmailValid && isRoleSelected && isNikValid && isPasswordValid;
  }
}
