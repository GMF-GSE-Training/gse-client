import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BaseInputComponent } from "../../input/base-input/base-input.component";
import { BlueButtonComponent } from "../../button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-email-form-card',
  standalone: true,
  imports: [
    BaseInputComponent,
    BlueButtonComponent,
    FormsModule,
  ],
  templateUrl: './email-form-card.component.html',
  styleUrl: './email-form-card.component.css'
})
export class EmailFormCardComponent {
  @Input() cardTitle: string = '';
  @Input() data: { email: string } = {
    email: '',
  };

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.data);
      this.form.resetForm();
    }
  }
}
