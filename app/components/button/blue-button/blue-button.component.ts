import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-blue-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blue-button.component.html',
  styleUrl: './blue-button.component.css'
})
export class BlueButtonComponent {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() disabled: boolean = false;
  @Output() blueButtonClick = new EventEmitter<void>();

  onBlueButtonClick() {
    this.blueButtonClick.emit();
  }
}
