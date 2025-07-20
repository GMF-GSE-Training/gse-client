import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { filter, map } from "rxjs";
import { SweetalertService } from "../service/sweetalert.service";

export const RoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const sweetalertService = inject(SweetalertService);

  // URL untuk login yang benar
  const loginUrl = '/auth/login';

  const redirect = (userRole: string) => {
    // Arahkan ke halaman yang sesuai berdasarkan role
    if (userRole === 'user') {
      router.navigateByUrl('/dashboard');
    } else if (['super admin', 'supervisor', 'lcu'].includes(userRole)) {
      router.navigateByUrl('/dashboard');
    } else {
      router.navigateByUrl('/not-found');
    }
    return false;
  };

  const cachedUserProfile = localStorage.getItem('user_profile');
  if(cachedUserProfile) {
    const userProfile = JSON.parse(cachedUserProfile);
    const userRole = userProfile.role?.name?.toLowerCase();
    const allowedRoles = (route.data['roles'] as string[] || []).map(role => role.toLowerCase());

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    sweetalertService.alert('Akses Ditolak', 'Role Anda tidak memiliki akses ke halaman ini.', 'error');
    // Delay lebih lama agar SweetAlert tampil
    setTimeout(() => redirect(userRole), 1000);
    return false;
  }

  return authService.userProfile$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => {
      if (!currentUser) {
        router.navigateByUrl(loginUrl);
        return false;
      }
      
      const userRole = currentUser.role?.name?.toLowerCase() || '';
      const allowedRoles = (route.data['roles'] as string[] || []).map(role => role.toLowerCase());
      
      if(allowedRoles.includes(userRole)) {
        return true;
      }
      
      sweetalertService.alert('Akses Ditolak', 'Role Anda tidak memiliki akses ke halaman ini.', 'error');
      // Delay lebih lama agar SweetAlert tampil
      setTimeout(() => redirect(userRole), 1000);
      return false;
    })
  );
};
