import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-participant-data',
  standalone: true,
  imports: [
    NavbarComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './participant-data.component.html',
  styleUrls: ['./participant-data.component.css']
})
export class ParticipantDataComponent {

  constructor(private router: Router) {}  // Inject Router

  onBack(): void {
    // Handle back button logic here, e.g., navigate to previous page
    this.router.navigate(['/previous-page']); // Ganti dengan rute yang sesuai
  }

  onSave(): void {
    // Handle save button logic here, e.g., save form data
    alert('Data saved successfully!');
  }
}
