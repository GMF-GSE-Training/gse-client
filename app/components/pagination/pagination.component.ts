import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalPages: number = 0;
  @Input() currentPage = 1;
  @Input() isLoading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();

  get pages(): (number | string)[] {
    const pageArray = [];

    if (this.totalPages <= 6) {
      // Jika total halaman kurang dari atau sama dengan 6, tampilkan semua halaman
      for (let i = 1; i <= this.totalPages; i++) {
        pageArray.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        // Jika berada di halaman awal (1-3)
        for (let i = 1; i <= 4; i++) {
          pageArray.push(i);
        }
        pageArray.push('...');
        pageArray.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        // Jika berada di halaman akhir (misalnya 13-15)
        pageArray.push(1);
        pageArray.push('...');
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pageArray.push(i);
        }
      } else {
        // Jika berada di halaman tengah
        pageArray.push(1);
        pageArray.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pageArray.push(i);
        }
        pageArray.push('...');
        pageArray.push(this.totalPages);
      }
    }

    return pageArray;
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page !== this.currentPage && !this.isLoading) {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages && !this.isLoading) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1 && !this.isLoading) {
      this.goToPage(this.currentPage - 1);
    }
  }
}
