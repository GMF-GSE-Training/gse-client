import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SweetalertService } from '../service/sweetaler.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sweetalertService = inject(SweetalertService);

  const cachedUserProfile = localStorage.getItem('user_profile');
  if(cachedUserProfile) {
    router.navigateByUrl('/home');
    if(route.routeConfig?.path === 'login') {
      sweetalertService.alert('Peringatan', 'Anda sudah login', 'warning');
    } else if(route.routeConfig?.path === 'register') {
      sweetalertService.alert('Peringatan', 'Anda sudah terdaftar', 'warning');
    }
    return false;
  }
  return true;
};
