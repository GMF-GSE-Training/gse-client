import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-year-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-navigation.component.html',
  styleUrl: './year-navigation.component.css'
})
export class YearNavigationComponent implements OnInit, OnChanges {
  @Input() selectedYear: number = new Date().getFullYear();
  @Input() availableYears: number[] = [];
  @Input() disabled: boolean = false;
  @Input() minYear: number = 1950;
  @Input() maxYear: number = 3001;
  @Output() yearChange = new EventEmitter<number>();

  displayYear: number = new Date().getFullYear();

  ngOnInit() {
    this.displayYear = this.selectedYear;
  }

  ngOnChanges() {
    this.displayYear = this.selectedYear;
  }

  previousYear(): void {
    if (this.disabled || this.displayYear <= this.minYear) return;
    
    this.displayYear--;
    this.yearChange.emit(this.displayYear);
  }

  nextYear(): void {
    if (this.disabled || this.displayYear >= this.maxYear) return;
    
    this.displayYear++;
    this.yearChange.emit(this.displayYear);
  }

  resetToCurrentYear(): void {
    if (this.disabled) return;
    
    const currentYear = new Date().getFullYear();
    this.displayYear = currentYear;
    this.yearChange.emit(this.displayYear);
  }

  canGoToPrevious(): boolean {
    return !this.disabled && this.displayYear > this.minYear;
  }

  canGoToNext(): boolean {
    return !this.disabled && this.displayYear < this.maxYear;
  }
}
