import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
  ],
  imports: [CommonModule],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css',
})
export class FileInputComponent {
  @Input() label: string = '';
  @Input() idInput!: string;
  @Input() placeholder: string = 'Maksimal 2 MB';
  @Input() fileName: string | null = null;
  @Input() fileType: string = '';
  @Input() required: boolean = false;
  @Input() isRequired: boolean = false;

  @Output() valueChange = new EventEmitter<File | null>();

  isFileSelected: boolean = true; // Flag untuk validasi apakah file sudah dipilih

  get displayFileName(): string {
    return this.fileName || this.placeholder;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
      this.isFileSelected = true; // Jika file dipilih, set flag isFileSelected menjadi true
      this.valueChange.emit(input.files[0]);
    } else {
      this.fileName = null;
      this.isFileSelected = false; // Jika file tidak dipilih, set flag isFileSelected menjadi false
      this.valueChange.emit(null);
    }
  }
}
