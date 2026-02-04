import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
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
export class EmailFormComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() isSubmitted: boolean = false;
  @Input() submitError: boolean = false;
  @Input() data: { email: string } = {
    email: '',
  };
  @Input() errorMessage: string = '';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() captchaVerified = new EventEmitter<string>();
  @Output() captchaExpired = new EventEmitter<void>();
  @Output() captchaError = new EventEmitter<any>();

  @ViewChild('form') form!: NgForm;

  hcaptchaToken: string = '';
  hcaptchaSitekey: string = '';

  ngOnInit(): void {
    this.hcaptchaSitekey = window.__env?.HCAPTCHA_SITEKEY || '';
    
    if (!this.hcaptchaSitekey) {
      console.error('❌ hCaptcha sitekey tidak ditemukan di window.__env');
      console.log('📋 window.__env:', window.__env);
    } else {
      console.log('✅ hCaptcha sitekey loaded:', this.hcaptchaSitekey);
    }
  }

  onSubmit() {
    if (!this.hcaptchaToken) {
      console.warn('⚠️ hCaptcha belum diverifikasi');
      return;
    }

    if (this.form.valid) {
      this.formSubmit.emit(this.data);
    }
  }

  onCaptchaVerified(token: string): void {
    console.log('✅ [CHILD] hCaptcha verified, token:', token.substring(0, 20) + '...');
    this.hcaptchaToken = token;
    this.captchaVerified.emit(token);
  }

  onCaptchaExpired(): void {
    console.warn('⚠️ [CHILD] hCaptcha expired');
    this.hcaptchaToken = '';
    this.captchaExpired.emit();
  }

  onCaptchaError(error: any): void {
    console.error('❌ [CHILD] hCaptcha error:', error);
    this.hcaptchaToken = '';
    this.captchaError.emit(error);
  }

  isEmailValid(email: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }
}