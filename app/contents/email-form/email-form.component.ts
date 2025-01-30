import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../components/title/title.component";
import { BaseInputComponent } from "../../components/input/base-input/base-input.component";
import { WhiteButtonComponent } from "../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthComponent } from "../../components/auth/auth.component";
import { RouterLink } from '@angular/router';

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
],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css', '../user-form/user-form.component.css']
})
export class EmailFormComponent {
  @Input() pageTitle: string = '';
  @Input() isSubmitted: boolean = false;
  @Input() submitError: boolean = false;
  @Input() data: { email: string } = {
    email: '',
  };

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.data);
    }
  }
}
