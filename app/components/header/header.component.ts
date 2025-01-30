import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    SidebarComponent,
    CommonModule,
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuVisible: boolean = false;
  shouldShowHeader = true;

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  onMenuClose() {
    this.isMenuVisible = false;
  }
}
