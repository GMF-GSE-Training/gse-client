import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseInputComponent } from "../base-input/base-input.component";

@Component({
  selector: 'app-dropdown-input',
  standalone: true,
  imports: [
    CommonModule,
    BaseInputComponent
],
  templateUrl: './dropdown-input.component.html',
  styleUrl: './dropdown-input.component.css'
})
export class DropdownInputComponent implements OnChanges {
  @Input() label: string = '';
  @Input() isRequired: boolean = false;
  @Input() options: { label: string, value: any }[] = []; // List of options
  @Input() placeholder: string = 'Select an option'; // Placeholder text
  @Input() selectedValue: any; // Initial selected value (optional)
  @Input() initialValue: string = '';
  @Input() showSearchItem: boolean = false;
  @Output() selectionChange = new EventEmitter<any>();

  isActive: boolean = false;
  searchText: string = ''; // For filtering options
  filteredOptions: { label: string, value: any }[] = []; // To hold filtered options

  ngOnChanges() {
    this.filteredOptions = [...this.options]; // Initialize filteredOptions with all options

    // Handle initial value selection
    if (this.initialValue !== null || this.initialValue !== undefined) {
      const selectedOption = this.options.find(option => option.value === this.initialValue);
      if (selectedOption) {
        this.selectedValue = selectedOption.label;
        this.selectionChange.emit(selectedOption.value);
      }
    }
  }

  // Toggle dropdown visibility
  onActive() {
    this.isActive = !this.isActive;
  }

  // Handle search and filter options
  onSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText = input;
    this.filteredOptions = this.options.filter(option =>
      option.label.toLowerCase().includes(this.searchText)
    );
  }

  // Set selected value and close dropdown
  onSelectOption(option: { label: string, value: any }) {
    this.selectedValue = option.label;
    this.selectionChange.emit(option.value);
    this.isActive = false; // Close dropdown after selecting
  }
}
