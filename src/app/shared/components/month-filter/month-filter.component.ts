import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MonthInfo {
  value: number;
  name: string;
  shortName: string;
  year: number;
}

@Component({
  selector: 'app-month-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-filter.component.html',
  styleUrl: './month-filter.component.css'
})
export class MonthFilterComponent implements OnInit, OnChanges {
  @Input() selectedMonth: number = new Date().getMonth() + 1; // 1-12
  @Input() selectedYear: number = new Date().getFullYear();
  @Output() monthChange = new EventEmitter<MonthInfo>();

  private readonly monthNames = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
  ];

  private readonly monthShortNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
    'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
  ];

  currentMonthInfo: MonthInfo = {
    value: new Date().getMonth() + 1,
    name: '',
    shortName: '',
    year: new Date().getFullYear()
  };

  ngOnInit(): void {
    this.updateCurrentMonthInfo();
  }

  ngOnChanges(): void {
    console.log('🗓️ Month Filter - ngOnChanges triggered:', {
      selectedMonth: this.selectedMonth,
      selectedYear: this.selectedYear,
      inputs: { month: this.selectedMonth, year: this.selectedYear },
      previousDisplay: this.currentMonthInfo,
      note: 'Input properties changed, updating display'
    });
    this.updateCurrentMonthInfo();
  }

  private updateCurrentMonthInfo(): void {
    this.currentMonthInfo = {
      value: this.selectedMonth,
      name: this.monthNames[this.selectedMonth - 1],
      shortName: this.monthShortNames[this.selectedMonth - 1],
      year: this.selectedYear
    };
  }

  previousMonth(): void {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.updateCurrentMonthInfo();
    this.monthChange.emit(this.currentMonthInfo);
  }

  nextMonth(): void {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.updateCurrentMonthInfo();
    this.monthChange.emit(this.currentMonthInfo);
  }

  resetToCurrentMonth(): void {
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();
    this.updateCurrentMonthInfo();
    this.monthChange.emit(this.currentMonthInfo);
  }
}
