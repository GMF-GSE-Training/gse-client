import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../../../components/title/title.component";
import { BaseInputComponent } from "../../../../components/input/base-input/base-input.component";
import { WhiteButtonComponent } from "../../../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../../../../components/header/header.component";

@Component({
  selector: 'app-capability-form',
  standalone: true,
  imports: [
    TitleComponent,
    BaseInputComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    FormsModule,
    CommonModule,
    RouterLink,
    HeaderComponent
],
  templateUrl: './capability-form.component.html',
  styleUrl: './capability-form.component.css'
})
export class CapabilityFormComponent {
  @Input() capability: any = {};
  @Input() pageTitle: string = '';

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.capability);
    }
  }
}
