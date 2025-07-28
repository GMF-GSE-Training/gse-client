import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../../components/title/title.component";
import { SearchComponent } from "../../../components/search/search.component";
import { ViewAllComponent } from "../../../components/view-all/view-all.component";
import { TableComponent } from "../../../components/table/table.component";
import { WhiteButtonComponent } from "../../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../../components/button/blue-button/blue-button.component";
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { RoleBasedAccessDirective } from '../../directive/role-based-access.directive';
import { RouterLink } from '@angular/router';
import { DateFilterComponent } from "../../../components/date-filter/date-filter.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [
    TitleComponent,
    SearchComponent,
    ViewAllComponent,
    TableComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    PaginationComponent,
    RoleBasedAccessDirective,
    RouterLink,
    DateFilterComponent,
    CommonModule,
],
  templateUrl: './data-management.component.html',
  styleUrl: './data-management.component.css'
})
export class DataManagementComponent {
  // Komponent title
  @Input() pageTitle: string = '';

  // Komponen tabel
  @Input() columns: { header: string, field: string, sortable?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() state: { data: any; } = { data: '' };
  @Input() isLoading: boolean = false;

  @Input() isParticipantCot: boolean = false;

  // Komponen pagination
  @Input() totalPages: number = 0;
  @Input() currentPage = 1;
  @Input() isLoadingPagination: boolean = false;
  @Output() pageChange = new EventEmitter<number>();

  onPageChanged(page: number | string) {
    if (typeof page === 'number' && page !== this.currentPage && !this.isLoading) {
      this.pageChange.emit(page);
    }
  }

  // Komponen search
  @Input() placeHolder: string = '';
  @Output() searchChange = new EventEmitter<string>();

  onSearchChanged(query: string) {
    this.searchChange.emit(query);
  }

  // Komponen view all
  @Output() viewAllChange = new EventEmitter();
  @ViewChild('dateFilterComponent') dateFilterComponent: DateFilterComponent | undefined;

  viewAll(searchComponent: SearchComponent, dateFilterComponent?: DateFilterComponent) {
    searchComponent.resetSearch();
    dateFilterComponent?.clearFilter();
    this.viewAllChange.emit();
  }

  // Komponen button
  @Input() blueButtonRoute: string = '';
  @Input() whiteButtonRoute: string = '/dashboard';

  // Role Based Access
  @Input() roleBassedAccess: string[] = [];

  @Output() onClickChange = new EventEmitter<void>();

  onClickChanged() {
    this.onClickChange.emit();
  }

  @Input() cotStatus: string = '';

  // Tambahan universal sorting
  @Input() sortBy: string = '';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';
  @Output() sortChange = new EventEmitter<{ sortBy: string, sortOrder: 'asc' | 'desc' }>();
  
  // Info message from backend (for search + sort scenarios)
  @Input() infoMessage: string | null = null;

  toggleSort(col: string) {
    // Find the column configuration
    const column = this.columns.find(c => c.field === col);
    
    // Don't sort if column is not sortable (action column or explicitly marked non-sortable)
    if (col === 'action' || (column && column.sortable === false)) {
      return;
    }
    
    // Check if search is active - provide informative feedback
    const searchInput = document.querySelector('input[name="q"]') as HTMLInputElement;
    const isSearchActive = searchInput && searchInput.value.trim().length > 0;
    
    if (isSearchActive) {
      console.log('🔍 Sorting within search results:', {
        searchQuery: searchInput.value,
        sortField: col,
        message: 'Sorting applied to filtered search results for optimal relevance'
      });
    }
    
    // Allow normal sorting behavior regardless of search state
    if (this.sortBy === col) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = col;
      this.sortOrder = 'asc';
    }
    this.sortChange.emit({ sortBy: this.sortBy, sortOrder: this.sortOrder });
  }
}
