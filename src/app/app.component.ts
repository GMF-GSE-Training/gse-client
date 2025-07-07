import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GMF Aeroasia';
  isAuthRoute: boolean = false;

  constructor(private router: Router) { }

  private destroy$ = new Subject<void>();

  private excludedRoutes = [
    '/login',
    '/register',
    '/password-reset',
    '/verification',
    '/users/add',
    // Tambahkan rute auth/ untuk mendukung lazy loading
    '/auth/login',
    '/auth/register',
    '/auth/password-reset',
    '/auth/verification',
  ];

  private excludedRoutesRegex = [
    /^\/users\/[a-f0-9\-]+\/edit(\?.*)?$/,
    /^\/reset\/[^/]+(\?.*)?$/,
  ];

  ngOnInit() {
    this.checkCurrentRoute();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.checkCurrentRoute());
  }

  private checkCurrentRoute() {
    const currentRoute = this.router.url.split('?')[0]; // Ignore query params
    this.isAuthRoute = (
      this.excludedRoutes.includes(currentRoute) ||
      this.excludedRoutesRegex.some(regex => regex.test(currentRoute))
    );
  }
}
