import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-page',
  standalone: true,
  imports: [],
  templateUrl: './status-page.component.html',
  styleUrl: './status-page.component.css'
})
export class StatusPageComponent {
  @Input() statusMessage: string = '';
}
