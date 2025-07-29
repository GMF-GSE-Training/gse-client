import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  @Input() placeHolder: string = '';
  @Input() autoSearchClear: boolean = false;
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchCleared = new EventEmitter<void>();
  private searchSubject = new Subject<string>();
  searchQuery: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['q']) {
        this.searchQuery = params['q'];
      }
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this.searchChange.emit(query);
    });
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.searchChange.emit(this.searchQuery);
  }

  onSearchInputChange() {
    if (this.searchQuery === '') {
      this.searchCleared.emit();
    } else {
      this.searchSubject.next(this.searchQuery);
    }
  }

  resetSearch(): void {
    this.searchQuery = ''; // Mengosongkan nilai input
    this.searchChange.emit(this.searchQuery);
  }
}
