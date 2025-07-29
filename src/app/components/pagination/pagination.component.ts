import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalPages: number = 0;
  @Input() currentPage = 1;
  @Input() isLoading: boolean = false;
  @Input() showGoToPage: boolean = true; // New feature toggle

  @Output() pageChange = new EventEmitter<number>();
  
  // Go to Page functionality
  goToPageInput: string = '';
  showGoToPageError: boolean = false;
  goToPageErrorMessage: string = '';
  showGoToPageSuccess: boolean = false;
  goToPageSuccessMessage: string = '';

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

  // Go to Page functionality methods
  onGoToPageSubmit() {
    const pageNumber = parseInt(this.goToPageInput.trim(), 10);
    
    // Reset error state
    this.showGoToPageError = false;
    this.goToPageErrorMessage = '';
    
    // Validate input
    if (isNaN(pageNumber) || this.goToPageInput.trim() === '') {
      this.showError('Masukkan nomor halaman yang valid');
      return;
    }
    
    if (pageNumber < 1) {
      this.showError('Nomor halaman tidak boleh kurang dari 1');
      return;
    }
    
    if (pageNumber > this.totalPages) {
      this.showError(`Nomor halaman tidak boleh lebih dari ${this.totalPages}`);
      return;
    }
    
    if (pageNumber === this.currentPage) {
      this.showError('Anda sudah berada di halaman tersebut');
      return;
    }
    
    // Success - go to page with visual feedback
    this.goToPage(pageNumber);
    this.clearGoToPageInput();
    
    // Show success feedback briefly
    this.showSuccessFeedback(`Menuju halaman ${pageNumber}...`);
  }
  
  private showError(message: string) {
    this.showGoToPageError = true;
    this.goToPageErrorMessage = message;
    
    // Auto-hide error after 3 seconds
    setTimeout(() => {
      this.showGoToPageError = false;
      this.goToPageErrorMessage = '';
    }, 3000);
  }
  
  private clearGoToPageInput() {
    this.goToPageInput = '';
    this.showGoToPageError = false;
    this.goToPageErrorMessage = '';
  }
  
  private showSuccessFeedback(message: string) {
    this.showGoToPageSuccess = true;
    this.goToPageSuccessMessage = message;
    
    // Auto-hide success after 1.5 seconds
    setTimeout(() => {
      this.showGoToPageSuccess = false;
      this.goToPageSuccessMessage = '';
    }, 1500);
  }
  
  onGoToPageKeyPress(event: KeyboardEvent) {
    // Allow only numbers, backspace, delete, arrow keys
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumber = /^[0-9]$/.test(event.key);
    
    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
    
    // Submit on Enter
    if (event.key === 'Enter') {
      this.onGoToPageSubmit();
    }
  }
  
  // Helper methods for template
  get shouldShowGoToPage(): boolean {
    return this.showGoToPage && this.totalPages > 1;
  }
  
  get goToPagePlaceholder(): string {
    // More descriptive placeholder
    if (this.totalPages <= 99) {
      return `Contoh: ${Math.min(this.currentPage + 1, this.totalPages)}`;
    }
    return `1-${this.totalPages}`;
  }
  
  get goToPageHelperText(): string {
    // Dynamic helper text based on context
    if (this.totalPages <= 5) {
      return `Halaman: 1-${this.totalPages}`;
    } else if (this.totalPages <= 20) {
      return `Masukkan halaman (1-${this.totalPages})`;
    } else {
      return `Ketik nomor halaman dan tekan Enter`;
    }
  }
}
