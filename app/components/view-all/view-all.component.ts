import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.css'
})
export class ViewAllComponent {
  @Output() viewAllChange = new EventEmitter();

  viewAll() {
    this.viewAllChange.emit();
  }
}
