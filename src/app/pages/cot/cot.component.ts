import { Component } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { WhiteButtonComponent } from '../../component/button/white-button/white-button.component';
import { BlueButtonComponent } from '../../component/button/blue-button/blue-button.component';

@Component({
  selector: 'app-cot',
  standalone: true,
  imports: [
    NavbarComponent,
    WhiteButtonComponent,
    BlueButtonComponent
  ],
  templateUrl: './cot.component.html',
  styleUrl: './cot.component.css'
})
export class CotComponent {

}
