import { Component } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { BlueButtonComponent } from '../../component/button/blue-button/blue-button.component';
import { WhiteButtonComponent } from '../../component/button/white-button/white-button.component';

@Component({
  selector: 'app-add-capability-data',
  standalone: true,
  imports: [
    NavbarComponent,
    BlueButtonComponent,
    WhiteButtonComponent
  ],
  templateUrl: './add-capability-data.component.html',
  styleUrl: './add-capability-data.component.css'
})
export class AddCapabilityDataComponent {

}
