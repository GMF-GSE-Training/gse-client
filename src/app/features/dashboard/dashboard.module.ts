import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

// Import any Angular Material or other shared modules used by DashboardComponent
// For example:
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatCardModule } from '@angular/material/card';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
    // Add Angular Material or other shared modules here
    // MatGridListModule,
    // MatCardModule,
    // MatMenuModule,
    // MatIconModule,
    // MatButtonModule,
  ]
  // No 'declarations' as DashboardComponent is standalone
})
export class DashboardModule { }
