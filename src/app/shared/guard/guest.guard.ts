import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SweetalertService } from '../service/sweetalert.service';
import { AuthService } from '../service/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sweetalertService = inject(SweetalertService);
  const authService = inject(AuthService);

  // URL untuk login yang benar
  const loginUrl = '/auth/login';

  const redirect = () => {
    router.navigateByUrl(loginUrl);
    return false;
  };

  // Ganti cachedUserProfile dengan getUserProfile()
  const userProfile = authService.getUserProfile();
  if (userProfile) {
    // sweetalertService.alert('Peringatan', 'Anda sudah login', 'warning');
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
