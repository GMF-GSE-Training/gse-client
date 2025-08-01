import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() sortBy: string = '';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';
  @Output() sortChange = new EventEmitter<{ sortBy: string, sortOrder: 'asc' | 'desc' }>();

  // State sorting
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get sortedData(): any[] {
    // Return data as-is since sorting is now handled by backend
    return this.data;
  }

  handleSort(field: string) {
    if (this.sortBy === field) {
      const newSortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortChange.emit({ sortBy: field, sortOrder: newSortOrder });
    } else {
      this.sortChange.emit({ sortBy: field, sortOrder: 'asc' });
    }
  }

  // Metode untuk memeriksa apakah kolom action memiliki nilai
  hasActionColumn(): boolean {
    return this.data.some(item =>
      item.printLink || item.addLink || item.editLink || item.deleteMethod || item.detailLink || item.select
    );
  }
}
