import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [
    CommonModule
],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.css'
})
export class DateFilterComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  startDate: string | null = '';
  endDate: string | null = '';
  isFilterVisible: boolean = false;
  showIndikator: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];
      this.applyFilter(this.startDate, this.endDate);
    });
  }

  toggleFilterContainer() {
    this.isFilterVisible = !this.isFilterVisible;
    console.log(this.isFilterVisible)
  }

  applyFilter(startDate?: string | null, endDate?: string | null) {
    this.isFilterVisible = false;
    this.showIndikator = true;
    this.router.navigate([], {
      queryParams: { startDate: startDate, endDate: endDate },
      queryParamsHandling: 'merge',
    });
  }

  clearFilter() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { startDate: undefined, endDate: undefined },
      queryParamsHandling: 'merge',
    });

    this.startDate = null;
    this.endDate = null;
    this.isFilterVisible = false;
    this.showIndikator = false;
  }
}
