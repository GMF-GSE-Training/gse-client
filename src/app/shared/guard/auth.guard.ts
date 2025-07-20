import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { catchError, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SweetalertService } from '../service/sweetalert.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const sweetalertService = inject(SweetalertService);
  
  // URL untuk login yang benar
  const loginUrl = '/auth/login';

  const redirect = () => {
    router.navigateByUrl(loginUrl);
    return false;
  };

  const cachedUserProfile = localStorage.getItem('user_profile');
  if(cachedUserProfile) {
    const userProfile = JSON.parse(cachedUserProfile);
    
    // Hanya paksa verifikasi untuk role 'user'
    const roleName = userProfile.role?.name?.toLowerCase();
    const isVerificationPage = state.url.startsWith('/auth/verification') || state.url.startsWith('/auth/verify');
    const isLoginPage = state.url.startsWith('/auth/login');

    // if (roleName === 'user' && !userProfile.verifiedAccount && !isVerificationPage && !isLoginPage) {
    //   sweetalertService
    //     .alert(
    //       'Peringatan',
    //       'Akun belum diverifikasi, silahkan verifikasi akun terlebih dahulu',
    //       'warning',
    //     )
    //     .finally(() => router.navigateByUrl('/auth/verification'));
    //   return false;
    // }
    
    return true;
  } else if (!cachedUserProfile) {
    return authService.me().pipe(
      map((response) => {
        const userData = response.data;
        localStorage.setItem('user_profile', JSON.stringify(userData));
        
        // Hanya paksa verifikasi untuk role 'user'
        const roleName = userData.role?.name?.toLowerCase();
        const isVerificationPage = state.url.startsWith('/auth/verification') || state.url.startsWith('/auth/verify');
        const isLoginPage = state.url.startsWith('/auth/login');

        // if (roleName === 'user' && !userData.verifiedAccount && !isVerificationPage && !isLoginPage) {
        //   sweetalertService
        //     .alert(
        //       'Peringatan',
        //       'Akun belum diverifikasi, silahkan verifikasi akun terlebih dahulu',
        //       'warning',
        //     )
        //     .finally(() => router.navigateByUrl('/auth/verification'));
        //   return false;
        // }
        
        return true;
      }),
      catchError(() => {
        redirect();
        return of(false);
      })
    );
  }

  return authService.userProfile$.pipe(
    filter((currentUser) => {
      if(!currentUser) {
        return redirect();
      }
      return currentUser !== undefined
    }),
    map((currentUser) => {
      if(!currentUser) {
        return redirect();
      }
      
      // Hanya paksa verifikasi untuk role 'user'
      const roleName = currentUser.role?.name?.toLowerCase();
      const isVerificationPage = state.url.startsWith('/auth/verification') || state.url.startsWith('/auth/verify');
      const isLoginPage = state.url.startsWith('/auth/login');

      // if (roleName === 'user' && !currentUser.verifiedAccount && !isVerificationPage && !isLoginPage) {
      //   sweetalertService
      //     .alert(
      //       'Peringatan',
      //       'Akun belum diverifikasi, silahkan verifikasi akun terlebih dahulu',
      //       'warning',
      //     )
      //     .finally(() => router.navigateByUrl('/auth/verification'));
      //   return false;
      // }
      
      return true;
    })
  );
};
