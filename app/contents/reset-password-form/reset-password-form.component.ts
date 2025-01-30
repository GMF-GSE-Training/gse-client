import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthComponent } from "../../components/auth/auth.component";
import { TitleComponent } from "../../components/title/title.component";
import { BaseInputComponent } from '../../components/input/base-input/base-input.component';
import { WhiteButtonComponent } from "../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [
    AuthComponent,
    TitleComponent,
    BaseInputComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    FormsModule,
    CommonModule,
    RouterLink,
],
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css', '../user-form/user-form.component.css']
})
export class ResetPasswordFormComponent {
  @Input() data: { newPassword: string, confirmNewPassword: string } = {
    newPassword: '',
    confirmNewPassword: '',
  };

  passwordMismatch: boolean = false;
  message: string = '';
  isNewPassVisible: boolean = false;
  isConfirmNewPassVisible: boolean = false;

  newPassVisible() {
    this.isNewPassVisible = !this.isNewPassVisible;
  }

  confirmNewPassVisible() {
    this.isConfirmNewPassVisible = !this.isConfirmNewPassVisible;
  }

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

  // Method untuk memvalidasi password match
  checkPasswordMatch() {
    if (this.data.newPassword && this.data.confirmNewPassword) {
      this.passwordMismatch = this.data.newPassword !== this.data.confirmNewPassword;
      if (this.passwordMismatch) {
        this.message = 'Password baru tidak sama';
      } else {
        this.message = '';
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.data);
    }
  }
}
