import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-year-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-picker.component.html',
  styleUrl: './year-picker.component.css'
})
export class YearPickerComponent implements OnInit {
  @Input() currentYear: number = new Date().getFullYear();
  @Input() availableYears: number[] = [];
  @Input() disabled: boolean = false;
  @Output() yearChange = new EventEmitter<number>();

  isDropdownOpen = false;
  filteredYears: number[] = [];

  ngOnInit() {
    this.updateFilteredYears();
  }

  ngOnChanges() {
    this.updateFilteredYears();
  }

  private updateFilteredYears() {
    if (this.availableYears.length > 0) {
      this.filteredYears = [...this.availableYears].sort((a, b) => b - a);
    } else {
      // Fallback: generate recent years if no data available
      const currentYear = new Date().getFullYear();
      this.filteredYears = Array.from(
        { length: 10 }, 
        (_, i) => currentYear - i
      );
    }
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  }

  selectYear(year: number) {
    if (!this.disabled && year !== this.currentYear) {
      this.currentYear = year;
      this.yearChange.emit(year);
    }
    this.isDropdownOpen = false;
  }

  onPreviousYear() {
    if (!this.disabled) {
      const currentIndex = this.filteredYears.indexOf(this.currentYear);
      if (currentIndex < this.filteredYears.length - 1) {
        const newYear = this.filteredYears[currentIndex + 1];
        this.selectYear(newYear);
      }
    }
  }

  onNextYear() {
    if (!this.disabled) {
      const currentIndex = this.filteredYears.indexOf(this.currentYear);
      if (currentIndex > 0) {
        const newYear = this.filteredYears[currentIndex - 1];
        this.selectYear(newYear);
      }
    }
  }

  canGoToPrevious(): boolean {
    const currentIndex = this.filteredYears.indexOf(this.currentYear);
    return currentIndex < this.filteredYears.length - 1;
  }

  canGoToNext(): boolean {
    const currentIndex = this.filteredYears.indexOf(this.currentYear);
    return currentIndex > 0;
  }

  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.year-picker-container')) {
      this.isDropdownOpen = false;
    }
  }
}
