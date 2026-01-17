import {
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject, } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SweetalertService } from '../service/sweetalert.service';
import { AuthService } from '../service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const sweetalertService = inject(SweetalertService);

  let isRefreshing = false;
  const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // Cek apakah request ini untuk public route (participant detail)
  const isPublicRoute = router.url.includes('/participants/') && router.url.includes('/detail');

  const userProfile = authService.getUserProfile();
  const authToken = userProfile?.accessToken;

  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('🔍 AuthInterceptor Error:', error);
      
      // Handle case when server returns HTML instead of JSON (usually authentication issue)
      if (error.status === 200 && error.error && typeof error.error === 'string' && error.error.includes('<!doctype')) {
        console.error('🔍 Server returned HTML instead of JSON. Possible authentication issue.');
        clearLocalStorageAndLogout(router, authService);
        sweetalertService.alert('Sesi Berakhir', 'Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
        router.navigate(['/login']);
        return throwError(() => new Error('Server returned HTML instead of JSON. Please login again.'));
      }
      
      // Untuk public route (participant detail), jangan redirect ke login saat 401
      if (error.status === 401 && !req.url.includes('/token')) {
        const isPublicRoute = router.url.includes('/participants/') && router.url.includes('/detail');
        if (isPublicRoute) {
          // Untuk public route, biarkan error diteruskan tanpa redirect
          return throwError(() => error);
        }
        return handle401Error(req, next, authService, router, sweetalertService, isRefreshing, refreshTokenSubject);
      }
      return throwError(() => error);
    })
  );
};

const handle401Error = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  sweetalertService: SweetalertService,
  isRefreshing: boolean,
  refreshTokenSubject: BehaviorSubject<string | null>
): Observable<HttpEvent<any>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        console.log("AuthInterceptor: Refresh Token Response", response);
        isRefreshing = false;
        refreshTokenSubject.next(response.data.accessToken || null);

        // Clone the original request with the new access token
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        });
        return next(clonedReq);
      }),
      catchError((err) => {
        isRefreshing = false;
        const isPublicRoute = router.url.includes('/participants/') && router.url.includes('/detail');
        if (!isPublicRoute) {
          clearLocalStorageAndLogout(router, authService);
          sweetalertService.alert('Selamat Datang!', 'Sesi tidak ditemukan, sudah mencoba login?', 'warning');
          router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      switchMap((token) => {
        if (token) {
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(clonedReq);
        }
        clearLocalStorageAndLogout(router, authService);
        sweetalertService.alert('Selamat Datang!', 'Sesi tidak ditemukan, sudah mencoba login?', 'warning');
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }
};

const clearLocalStorageAndLogout = (router: Router, authService: AuthService) => {
  localStorage.clear();
  sessionStorage.clear();
  authService.setUserProfile(null);
};
