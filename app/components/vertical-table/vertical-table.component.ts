import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RoleBasedAccessDirective } from '../../shared/directive/role-based-access.directive';

@Component({
  selector: 'app-vertical-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RoleBasedAccessDirective
],
  templateUrl: './vertical-table.component.html',
  styleUrl: './vertical-table.component.css'
})
export class VerticalTableComponent {
  constructor(private router:Router) {}

  @Input() data: {label: string, value?: string, link?: string}[] = [];
  @Input() isParticipantDetail: boolean = false;

  @Output() downloadDocumentClick = new EventEmitter<void>();

  lihatDokumen(link: string): void {
    this.router.navigate([link]);
  }

  downloadDocument() {
    this.downloadDocumentClick.emit();
  }

  get firstHalf() {
    return this.data.slice(0, Math.ceil(this.data.length / 2));
  }

  get secondHalf() {
    return this.data.slice(Math.ceil(this.data.length / 2));
  }
}
