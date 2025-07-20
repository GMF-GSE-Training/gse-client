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
    return this.http.post<WebResponse<AuthResponse>>(url, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.data) {
          this.setUserProfile(response.data);
        }
      })
    );
  }

  me(): Observable<WebResponse<AuthResponse>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'base'));
    return this.http.get<WebResponse<AuthResponse>>(url, { withCredentials: true }).pipe(
      tap((response) => {
        this.setUserProfile(response.data);
      })
    );
  }

  refreshToken(): Observable<WebResponse<AuthResponse>> {
    const userProfile = this.getUserProfile();
    const refreshToken = userProfile?.refreshToken;

    console.log("AuthService: Refresh Token from localStorage", refreshToken);

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token not found. Please log in again.'));
    }

    const url = this.envService.buildUrl(this.envService.getEndpoint('auth', 'refreshToken'));
    return this.http.post<WebResponse<AuthResponse>>(url, { refreshToken }, { withCredentials: true })
        .pipe(
            tap(response => {
                if (response.data) {
                    this.setUserProfile(response.data);
                }
            }),
            catchError(error => {
                console.error('Error refreshing token:', error);
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

  setUserProfile(data: AuthResponse | null) {
    if (data) {
      console.log("setUserProfile: Incoming data", data);
      const existingProfileString = localStorage.getItem('user_profile');
      let existingProfile: AuthResponse | null = null;
      if (existingProfileString) {
        try {
          existingProfile = JSON.parse(existingProfileString);
          console.log("setUserProfile: Existing profile from localStorage", existingProfile);
        } catch (e) {
          console.error("Error parsing existing user profile from localStorage", e);
        }
      }

      const updatedProfile: AuthResponse = {
        ...existingProfile, // Ambil data yang sudah ada
        ...data,            // Timpa dengan data baru
        // Pertahankan token lama jika data baru tidak menyediakannya
        accessToken: data.accessToken || existingProfile?.accessToken,
        refreshToken: data.refreshToken || existingProfile?.refreshToken,
      };

      console.log("setUserProfile: Merged profile to be saved", updatedProfile);
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      this.userProfile$.next(updatedProfile);
    } else {
      localStorage.removeItem('user_profile');
      this.userProfile$.next(null);
    }
  }

  getUserProfile(): AuthResponse | null {
    const profileString = localStorage.getItem('user_profile');
    console.log("getUserProfile: Raw profile string from localStorage", profileString);
    if (profileString) {
      try {
        const parsedProfile = JSON.parse(profileString);
        console.log("getUserProfile: Parsed profile from localStorage", parsedProfile);
        return parsedProfile;
      } catch (e) {
        console.error("Error parsing user profile from localStorage in getUserProfile", e);
        return null;
      }
    }
    return null;
  }
}
