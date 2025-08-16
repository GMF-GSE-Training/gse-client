import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
  @Input() columns: { header: string, field: string, sortable?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() state: { data: any; } = { data: '' };
  @Input() placeholderRows: number = 10; // Jumlah baris placeholder
  @Input() isLoading: boolean = false;
  @Input() sortBy: string = '';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';
  @Output() sortChange = new EventEmitter<{ sortBy: string, sortOrder: 'asc' | 'desc' }>();

  constructor(private router: Router) {}

  // State sorting
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get sortedData(): any[] {
    // Return data as-is since sorting is now handled by backend
    console.log('🔄 Table Component - sortedData getter called:', {
      dataLength: this.data?.length || 0,
      data: this.data?.slice(0, 2) || [],
      isLoading: this.isLoading,
      note: 'Data yang diterima table component'
    });
    return this.data || [];
  }

  isPrintIconDisable(printLink: any): boolean {
    if (!printLink) return false;

    const endDate = new Date(printLink.endDate);
    const now = new Date();

    return endDate > now;
  }

  handleSort(field: string) {
    // Find the column configuration
    const column = this.columns.find(col => col.field === field);

    // Don't handle sort if column is not found or not sortable
    if (!column || !this.isColumnSortable(column)) {
      return;
    }

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

  // Metode untuk memeriksa apakah kolom bisa diurutkan
  isColumnSortable(column: { header: string, field: string, sortable?: boolean }): boolean {
    // Action column is never sortable
    if (column.field === 'action') {
      return false;
    }
    // Default sortable is true for backward compatibility
    // Only return false if explicitly set to false
    return column.sortable !== false;
  }

  // Navigate with state for certificate view links
  navigateWithState(viewLink: string, state: any) {
    this.router.navigateByUrl(viewLink, { state });
  }
}
