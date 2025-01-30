import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-password-visibility',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './toggle-password-visibility.component.html',
  styleUrl: './toggle-password-visibility.component.css'
})
export class TogglePasswordVisibilityComponent {
  @Input() isPassVisible: boolean = false;
  @Output() togglePassClick = new EventEmitter<void>();

  passVisible() {
    this.togglePassClick.emit();
  }
}
