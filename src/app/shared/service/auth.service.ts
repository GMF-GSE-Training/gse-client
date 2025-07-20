import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { AuthResponse, LoginUserRequest, RegisterUserRequest, UpdatePassword } from '../model/auth.model';
import { WebResponse } from '../model/web.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  register(request: RegisterUserRequest): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'register'));
    return this.http.post<WebResponse<string>>(url, request)
      .pipe(
        catchError(error => {
          // Jika error SMTP (email gagal terkirim), tetap anggap sukses
          if (error.error?.message?.includes('ETIMEDOUT') || 
              error.error?.message?.includes('ECONNREFUSED') ||
              error.error?.message?.includes('ESOCKET') ||
              error.message?.includes('connect')) {
            const response: WebResponse<string> = {
              code: 201,
              status: 'OK',
              data: 'Register berhasil, link verifikasi akan dikirim ke email anda'
            };
            return of(response);
          }
          throw error;
        })
      );
  }

  login(request: LoginUserRequest): Observable<WebResponse<AuthResponse>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'login'));
    console.log('🔍 AuthService: Login URL:', url);
    
    return this.http.post<WebResponse<AuthResponse>>(url, request, { withCredentials: true }).pipe(
      tap(response => {
        console.log('🔍 AuthService: Login response received:', response);
        if (response.data) {
          this.setUserProfile(response.data);
        }
      }),
      catchError(error => {
        console.error('🔍 AuthService: Login error:', error);
        throw error;
      })
    );
  }

  me(): Observable<WebResponse<AuthResponse>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'base'));
    console.log('🔍 AuthService: Me URL:', url);
    
    return this.http.get<WebResponse<AuthResponse>>(url, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('🔍 AuthService: Me response received:', response);
        this.setUserProfile(response.data);
      }),
      catchError(error => {
        console.error('🔍 AuthService: Me error:', error);
        throw error;
      })
    );
  }

  refreshToken(): Observable<WebResponse<AuthResponse>> {
    const userProfile = this.getUserProfile();
    const refreshToken = userProfile?.refreshToken;

    console.log("🔍 AuthService: Refresh Token attempt", {
      hasUserProfile: !!userProfile,
      hasRefreshToken: !!refreshToken,
      refreshTokenLength: refreshToken?.length
    });

    if (!refreshToken) {
      console.error('🔍 AuthService: No refresh token found');
      return throwError(() => new Error('Refresh token not found. Please log in again.'));
    }

    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'refreshToken'));
    console.log('🔍 AuthService: Refresh Token URL:', url);
    
    return this.http.post<WebResponse<AuthResponse>>(url, { refreshToken }, { withCredentials: true })
        .pipe(
            tap(response => {
                // Validasi response
                if (!response || typeof response.data !== 'object' || !response.data.accessToken || typeof response.data.accessToken !== 'string') {
                  console.error('🔍 AuthService: Invalid refresh token response', response);
                  // Tambahkan kode error khusus
                  throw { code: 'REFRESH_INVALID_RESPONSE', message: 'Refresh token response invalid', response };
                }
                console.log('🔍 AuthService: Refresh Token success:', response);
                this.setUserProfile(response.data);
            }),
            catchError(error => {
                if (error?.code === 'REFRESH_INVALID_RESPONSE') {
                  // Jangan update localStorage, langsung throw error
                  console.error('🔍 AuthService: REFRESH_INVALID_RESPONSE', error);
                  return throwError(() => error);
                }
                console.error('🔍 AuthService: Refresh Token error:', error);
                this.setUserProfile(null);
                return throwError(() => error);
            })
        );
  }

  forgotPassword(request: { email: string; hcaptchaToken: string }): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'resetPasswordRequest'));
    return this.http.post<WebResponse<string>>(url, request);
  }

  resetPassword(request: UpdatePassword): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'resetPassword'));
    return this.http.post<WebResponse<string>>(url, request);
  }

  resendVerification(email: string): Observable<string> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'accountVerificationRequest'));
    return this.http.post<string>(url, { email }).pipe(
      catchError(error => {
        // Jika error terkait SMTP, anggap sebagai sukses
        if (error.error?.message?.includes('ETIMEDOUT') || 
            error.error?.message?.includes('Error sending email') ||
            error.error?.message?.includes('ECONNREFUSED')) {
          console.warn('SMTP Error ignored:', error);
          return of('Link verifikasi akan dikirim ke email Anda');
        }
        return throwError(() => error);
      })
    );
  }

  verifyAccount(token: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'verify'));
    return this.http.post<WebResponse<string>>(url, { token });
  }

  updateEmailRequest(request: { email: string }): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'updateEmailRequest'));
    return this.http.post<WebResponse<string>>(url, request, { withCredentials: true });
  }

  updatePassword(request: UpdatePassword): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'updatePassword'));
    return this.http.post<WebResponse<string>>(url, request, { withCredentials: true });
  }

  logout(): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'base'));
    return this.http.delete<WebResponse<string>>(url, { withCredentials: true });
  }

  userProfile$ = new BehaviorSubject<AuthResponse | null | undefined>(undefined);

  // Update 2025: Improved token management
  setUserProfile(data: AuthResponse | null) {
    console.log('🔍 AuthService: setUserProfile called with:', data ? 'data' : 'null');
    if (data) {
      // Validate required fields
      if (!data.accessToken || typeof data.accessToken !== 'string' || data.accessToken.length < 20) {
        console.error('🔍 AuthService: No valid access token in user profile', data);
        return;
      }
      const existingProfileString = localStorage.getItem('user_profile');
      let existingProfile: AuthResponse | null = null;
      if (existingProfileString) {
        try {
          existingProfile = JSON.parse(existingProfileString);
          console.log('🔍 AuthService: Existing profile found:', {
            hasAccessToken: !!existingProfile?.accessToken,
            hasRefreshToken: !!existingProfile?.refreshToken
          });
        } catch (e) {
          console.error('🔍 AuthService: Error parsing existing profile:', e);
          localStorage.removeItem('user_profile');
        }
      }
      // Merge profiles with priority to new data
      const updatedProfile: AuthResponse = {
        ...existingProfile,
        ...data,
        accessToken: data.accessToken || existingProfile?.accessToken,
        refreshToken: data.refreshToken || existingProfile?.refreshToken,
      };
      if (!updatedProfile.accessToken || typeof updatedProfile.accessToken !== 'string' || updatedProfile.accessToken.length < 20) {
        console.error('🔍 AuthService: Refusing to save profile with invalid accessToken', updatedProfile);
        return;
      }
      try {
        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
        this.userProfile$.next(updatedProfile);
        console.log('🔍 AuthService: Profile saved successfully');
      } catch (e) {
        console.error('🔍 AuthService: Error saving profile to localStorage:', e);
      }
    } else {
      console.log('🔍 AuthService: Clearing user profile');
      localStorage.removeItem('user_profile');
      this.userProfile$.next(null);
    }
  }

  // Update 2025: Robust token retrieval
  getUserProfile(): AuthResponse | null {
    try {
      const profileString = localStorage.getItem('user_profile');
      console.log('🔍 AuthService: getUserProfile - raw string length:', profileString?.length);
      if (!profileString) {
        console.log('🔍 AuthService: No profile found in localStorage');
        return null;
      }
      let parsedProfile: any = null;
      try {
        parsedProfile = JSON.parse(profileString);
      } catch (e) {
        console.error('🔍 AuthService: Error parsing user profile from localStorage, clearing storage', e);
        localStorage.removeItem('user_profile');
        return null;
      }
      if (!parsedProfile || typeof parsedProfile !== 'object' || !parsedProfile.accessToken || typeof parsedProfile.accessToken !== 'string' || parsedProfile.accessToken.length < 20) {
        console.error('🔍 AuthService: Invalid or missing accessToken in profile, clearing storage', parsedProfile);
        localStorage.removeItem('user_profile');
        return null;
      }
      console.log('🔍 AuthService: Profile retrieved successfully:', {
        hasAccessToken: !!parsedProfile.accessToken,
        hasRefreshToken: !!parsedProfile.refreshToken,
        accessTokenLength: parsedProfile.accessToken?.length,
        refreshTokenLength: parsedProfile.refreshToken?.length
      });
      return parsedProfile;
    } catch (e) {
      console.error('🔍 AuthService: Error retrieving user profile:', e);
      localStorage.removeItem('user_profile');
      return null;
    }
  }

  // Update 2025: Token validation
  isTokenValid(): boolean {
    const profile = this.getUserProfile();
    if (!profile?.accessToken) {
      console.log('🔍 AuthService: No access token found');
      return false;
    }

    // Basic token validation (you can add more sophisticated validation)
    const tokenLength = profile.accessToken.length;
    if (tokenLength < 50) {
      console.warn('🔍 AuthService: Token seems too short:', tokenLength);
      return false;
    }

    console.log('🔍 AuthService: Token validation passed');
    return true;
  }

  // Update 2025: Clear all auth data
  clearAuthData(): void {
    console.log('🔍 AuthService: Clearing all auth data');
    localStorage.removeItem('user_profile');
    sessionStorage.clear();
    this.userProfile$.next(null);
  }
}
