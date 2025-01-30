import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { IconActionComponent } from "../icon-action/icon-action.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { SearchComponent } from "../search/search.component";
import { BlueButtonComponent } from "../button/blue-button/blue-button.component";
import { WhiteButtonComponent } from "../button/white-button/white-button.component";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    IconActionComponent,
    PaginationComponent,
    SearchComponent,
    BlueButtonComponent,
    WhiteButtonComponent
],
  templateUrl: './participant-cot-modal.component.html',
  styleUrl: './participant-cot-modal.component.css'
})
export class ParticipantCotModalComponent {
  @Input() columns: { header: string, field: string }[] = [];
  @Input() data: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() placeholderRows: number = 10;

  @Output() selectedIdsChange = new EventEmitter<Set<number | string>>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  selectedIds: Set<number | string> = new Set();

  // Pagination properties
  @Input() currentPage: number = 1;
  @Input() totalPage: number = 10; // Jumlah item per halaman
  @Output() pageChange = new EventEmitter<number>();

  @Input() placeHolder: string = '';
  @Output() searchChange = new EventEmitter<string>();

  get isSaveDisabled(): boolean {
    return this.selectedIds.size === 0;
  }

  hasActionColumn(): boolean {
    return this.data.some(item =>
      item.printLink || item.addLink || item.editLink || item.deleteMethod || item.detailLink || item.select
    );
  }

  onSearchChanged(query: string) {
    this.searchChange.emit(query);
  }

  onPageChanged(page: number | string) {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onSelectChange(itemId: number | string) {
    // Temukan item yang sesuai
    const item = this.data.find(d => d.id === itemId);
    if (item) {
      // Toggle status select
      item.select = !item.select;

      // Update selectedIds
      if (item.select) {
        this.selectedIds.add(itemId);
      } else {
        this.selectedIds.delete(itemId);
      }

      // Emit perubahan
      this.selectedIdsChange.emit(this.selectedIds);
    }
  }

  // Tambahkan metode untuk menerapkan status select
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      // Terapkan status select berdasarkan selectedIds
      this.data.forEach(item => {
        item.select = this.selectedIds.has(item.id);
      });
    }
  }

  onSave() {
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
