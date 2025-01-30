import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BaseInputComponent } from "../../input/base-input/base-input.component";
import { BlueButtonComponent } from "../../button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-update-form-card',
  standalone: true,
  imports: [
    BaseInputComponent,
    BlueButtonComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './password-update-form-card.component.html',
  styleUrl: './password-update-form-card.component.css'
})
export class PasswordUpdateFormCardComponent {
  @Input() cardTitle: string = '';
  @Input() data: { newPassword: string, confirmNewPassword: string } = {
    newPassword: '',
    confirmNewPassword: '',
  };

  passwordMismatch: boolean = false;
  message: string = '';
  isPassVisible1: boolean = false;
  passVisible1() {
    this.isPassVisible1 = !this.isPassVisible1;
  }

  isPassVisible2: boolean = false;
  passVisible2() {
    this.isPassVisible2 = !this.isPassVisible2;
  }

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

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
      this.form.resetForm();
    }
  }
}
