import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-red-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './red-button.component.html',
  styleUrl: './red-button.component.css'
})
export class RedButtonComponent {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() disabled: boolean = false;
  @Output() redButtonClick = new EventEmitter<void>();

  onRedButtonClick() {
    this.redButtonClick.emit();
  }
}
