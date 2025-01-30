import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthComponent } from "../../components/auth/auth.component";
import { TitleComponent } from "../../components/title/title.component";
import { TogglePasswordVisibilityComponent } from "../../components/toggle-password-visibility/toggle-password-visibility.component";
import { BlueButtonComponent } from "../../components/button/blue-button/blue-button.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginUserRequest } from '../../shared/model/auth.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    AuthComponent,
    TitleComponent,
    TogglePasswordVisibilityComponent,
    BlueButtonComponent,
    RouterLink,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  @Input() loginError: boolean = false;
  @Input() message: string = '';
  @Input() loginRequest: LoginUserRequest = {
    identifier: '',
    password: '',
  };
  @Input() isPassVisible: boolean = false;
  @Input() isLoading: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

  passVisible() {
    this.isPassVisible = !this.isPassVisible;
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.loginRequest);
    }
  }
}
