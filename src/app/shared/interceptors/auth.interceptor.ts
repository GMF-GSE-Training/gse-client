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

  // Update 2025: Enhanced token retrieval and validation
  const userProfile = authService.getUserProfile();
  const authToken = userProfile?.accessToken;

  console.log('🔍 AuthInterceptor: Processing request:', {
    url: req.url,
    method: req.method,
    hasUserProfile: !!userProfile,
    hasAuthToken: !!authToken,
    tokenLength: authToken?.length,
    isTokenValid: authService.isTokenValid()
  });

  // Add Authorization header if token exists and is valid
  if (authToken && authService.isTokenValid()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log('🔍 AuthInterceptor: Added Authorization header');
  } else {
    console.warn('🔍 AuthInterceptor: No valid token found, proceeding without Authorization header');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('🔍 AuthInterceptor Error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error
      });
      
      // Handle case when server returns HTML instead of JSON (usually authentication issue)
      if (error.status === 200 && error.error && typeof error.error === 'string' && error.error.includes('<!doctype')) {
        console.error('🔍 AuthInterceptor: Server returned HTML instead of JSON. Possible authentication issue.');
        clearLocalStorageAndLogout(router, authService);
        sweetalertService.alert('Sesi Berakhir', 'Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
        router.navigate(['/login']);
        return throwError(() => new Error('Server returned HTML instead of JSON. Please login again.'));
      }
      
      // Handle 401 Unauthorized errors
      if (error.status === 401 && !req.url.includes('/token')) {
        console.log('🔍 AuthInterceptor: Handling 401 error for URL:', req.url);
        return handle401Error(req, next, authService, router, sweetalertService, isRefreshing, refreshTokenSubject);
      }

      // Handle other errors
      console.error('🔍 AuthInterceptor: Unhandled error:', error);
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
  console.log('🔍 AuthInterceptor: Starting 401 error handling');

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    console.log('🔍 AuthInterceptor: Attempting token refresh');

    return authService.refreshToken().pipe(
      switchMap((response) => {
        console.log("🔍 AuthInterceptor: Token refresh successful", {
          hasNewToken: !!response.data?.accessToken,
          tokenLength: response.data?.accessToken?.length
        });
        
        isRefreshing = false;
        refreshTokenSubject.next(response.data?.accessToken || null);

        // Clone the original request with the new access token
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.data?.accessToken}`,
          },
        });
        
        console.log('🔍 AuthInterceptor: Retrying original request with new token');
        return next(clonedReq);
      }),
      catchError((err) => {
        console.error('🔍 AuthInterceptor: Token refresh failed:', err);
        isRefreshing = false;
        clearLocalStorageAndLogout(router, authService);
        sweetalertService.alert('Sesi Berakhir', 'Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  } else {
    console.log('🔍 AuthInterceptor: Token refresh already in progress, waiting for completion');
    return refreshTokenSubject.pipe(
      switchMap((token) => {
        if (token) {
          console.log('🔍 AuthInterceptor: Using refreshed token for request');
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(clonedReq);
        }
        
        console.error('🔍 AuthInterceptor: No token available after refresh');
        clearLocalStorageAndLogout(router, authService);
        sweetalertService.alert('Sesi Berakhir', 'Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }
};

// Update 2025: Enhanced logout function
const clearLocalStorageAndLogout = (router: Router, authService: AuthService) => {
  console.log('🔍 AuthInterceptor: Clearing auth data and logging out');
  
  // Use the new clearAuthData method
  authService.clearAuthData();
  
  // Additional cleanup if needed
  try {
    // Clear any other auth-related data
    localStorage.removeItem('user_profile');
    sessionStorage.clear();
    
    // Clear any cookies if using them
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('🔍 AuthInterceptor: Auth data cleared successfully');
  } catch (error) {
    console.error('🔍 AuthInterceptor: Error clearing auth data:', error);
  }
};
