import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconActionComponent } from "../icon-action/icon-action.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconActionComponent,
],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class  TableComponent {
  @Input() columns: { header: string, field: string }[] = [];
  @Input() data: any[] = [];
  @Input() state: { data: any; } = { data: '' };
  @Input() certificateState: any;
  @Input() placeholderRows: number = 10; // Jumlah baris placeholder
  @Input() isLoading: boolean = false;

  // State sorting
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get sortedData(): any[] {
    if (!this.sortField) return this.data;
    return [...this.data].sort((a, b) => {
      const aValue = a[this.sortField!];
      const bValue = b[this.sortField!];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return this.sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  handleSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  // Metode untuk memeriksa apakah kolom action memiliki nilai
  hasActionColumn(): boolean {
    return this.data.some(item =>
      item.printLink || item.addLink || item.editLink || item.deleteMethod || item.detailLink || item.select
    );
  }
}
