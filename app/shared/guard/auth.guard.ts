import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { catchError, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const redirect = () => {
    router.navigateByUrl('/login');
    return false;
  };

  const cachedUserProfile = localStorage.getItem('user_profile');
  if(cachedUserProfile) {
    return true;
  } else if (!cachedUserProfile) {
    return authService.me().pipe(
      map((response) => {
        localStorage.setItem('user_profile', JSON.stringify(response.data));
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
      return true;
    })
  );
};
