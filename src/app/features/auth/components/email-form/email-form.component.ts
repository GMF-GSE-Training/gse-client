import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../../../components/title/title.component";
import { BaseInputComponent } from "../../../../components/input/base-input/base-input.component";
import { WhiteButtonComponent } from "../../../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthComponent } from "../../../../components/auth/auth.component";
import { RouterLink } from '@angular/router';
import { NgHcaptchaModule } from 'ng-hcaptcha';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [
    TitleComponent,
    BaseInputComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    FormsModule,
    CommonModule,
    AuthComponent,
    RouterLink,
    NgHcaptchaModule,
  ],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css', '../../../users/components/user-form/user-form.component.css']
})
export class EmailFormComponent {
  @Input() pageTitle: string = '';
  @Input() isSubmitted: boolean = false;
  @Input() submitError: boolean = false;
  @Input() data: { email: string } = {
    email: '',
  };
  @Input() errorMessage: string = '';
  @Input() hcaptchaToken: string = '';

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;
  @Output() captchaVerified = new EventEmitter<any>();
  @Output() captchaExpired = new EventEmitter<void>();
  @Output() captchaError = new EventEmitter<any>();

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.data);
    }
  }

  isEmailValid(email: string): boolean {
    // Regex sederhana untuk validasi email
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }
}
