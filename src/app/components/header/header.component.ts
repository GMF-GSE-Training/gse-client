import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, SidebarComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuVisible: boolean = false;
  shouldShowHeader: boolean = true;

  // Mengambil data pengguna dari localStorage dengan type safety
  private userProfile: { id?: string; name?: string; role?: { name?: string }; participant?: { id?: string } } = JSON.parse(localStorage.getItem('user_profile') ?? '{}');

  // Getter untuk nama pengguna dengan fallback
  get userName(): string {
    return this.userProfile.name ?? 'Pengguna';
  }

  // Getter untuk ID pengguna dengan fallback
  get userId(): string {
    return this.userProfile.id ?? '';
  }

  // Getter untuk route link profile berdasarkan role
  get profileLink(): string {
    const role = this.userProfile.role?.name;
    if (role === 'user' && this.userProfile.participant?.id) {
      return `/participants/${this.userProfile.participant.id}/profile/personal`;
    }
    return `/users/${this.userId}/profile`;
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  onMenuClose(): void {
    this.isMenuVisible = false;
  }
}
