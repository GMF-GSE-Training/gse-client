import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../components/title/title.component";
import { BaseInputComponent } from "../../components/input/base-input/base-input.component";
import { FileInputComponent } from "../../components/input/file-input/file-input.component";
import { WhiteButtonComponent } from "../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../components/button/blue-button/blue-button.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownInputComponent } from "../../components/input/dropdown-input/dropdown-input.component";
import { RouterLink } from '@angular/router';
import { SignatureType } from '../../shared/model/e-sign.model';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-e-sign-form',
  standalone: true,
  imports: [
    TitleComponent,
    BaseInputComponent,
    FileInputComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    CommonModule,
    FormsModule,
    DropdownInputComponent,
    RouterLink,
    HeaderComponent
],
  templateUrl: './e-sign-form.component.html',
  styleUrl: './e-sign-form.component.css'
})
export class ESignFormComponent {
  @Input() pageTitle: string = '';
  @Input() eSign: any = {};
  @Input() isUpdate: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() fileChange = new EventEmitter<{ property: string, file: File | null }>();

  @ViewChild('form') form!: NgForm;

  statusOptions: { label: string, value: boolean }[] = [
    {
      label: 'Aktif',
      value: true
    },
    {
      label: 'Tidak aktif',
      value: false,
    }
  ];
  status: boolean = false;

  signatureTypeOptions: { label: string, value: string }[] = [
    {
      label: 'Tanda tangan 1',
      value:  SignatureType.SIGNATURE1,
    },
    {
      label: 'Tanda tangan 2',
      value: SignatureType.SIGNATURE2,
    }
  ];

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.eSign);
    }
  }

  onFileChange(property: string, file: File | null): void {
    if (property === 'eSign') {
      this.eSign.eSignFileName = file ? file.name : null;
    }
    this.fileChange.emit({ property, file });
  }

  onStatusSelected(status: boolean) {
    this.eSign.status = status;
  }

  onSignatureTypeSelected(signatureType: SignatureType) {
    this.eSign.signatureType = signatureType;
  }
}
