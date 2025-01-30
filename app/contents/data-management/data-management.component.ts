import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../components/title/title.component";
import { SearchComponent } from "../../components/search/search.component";
import { ViewAllComponent } from "../../components/view-all/view-all.component";
import { TableComponent } from "../../components/table/table.component";
import { WhiteButtonComponent } from "../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../components/button/blue-button/blue-button.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { RoleBasedAccessDirective } from '../../shared/directive/role-based-access.directive';
import { RouterLink } from '@angular/router';
import { DateFilterComponent } from "../../components/date-filter/date-filter.component";
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
  @Input() columns: { header: string, field: string }[] = [];
  @Input() data: any[] = [];
  @Input() state: { data: any; } = { data: '' };
  @Input() certificateState: any;
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
  @Input() whiteButtonRoute: string = '/home';

  // Role Based Access
  @Input() roleBassedAccess: string[] = [];

  @Output() onClickChange = new EventEmitter<void>();

  onClickChanged() {
    this.onClickChange.emit();
  }
}
