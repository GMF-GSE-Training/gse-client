import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginUserRequest, RegisterUserRequest, UpdatePassword } from '../model/auth.model';
import { environment } from '../../../environments/environment.development';
import { WebResponse } from '../model/web.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.auth;

  constructor(
    private readonly http: HttpClient,
  ) { }

  register(request: RegisterUserRequest): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.register}`, request);
  }

  login(request: LoginUserRequest): Observable<WebResponse<AuthResponse>> {
    return this.http.post<WebResponse<AuthResponse>>(`${this.apiUrl}/${this.endpoint.login}`, request, { withCredentials: true });
  }

  me(): Observable<WebResponse<AuthResponse>> {
    return this.http.get<WebResponse<AuthResponse>>(`${this.apiUrl}/${this.endpoint.base}`, { withCredentials: true }).pipe(
      tap((response) => {
        this.userProfile$.next(response.data);
      })
    );
  }

  refreshToken(): Observable<WebResponse<string>> {
    return this.http.get<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.refreshToken}`, { withCredentials: true });
  }

  forgotPassword(request: { email: string }): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.resetPasswordRequest}`, request);
  }

  resetPassword(request: UpdatePassword): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.resetPassword}`, request);
  }

  resendVerification(request: { email: string }): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.accountVerificationRequest}`, request);
  }

  updateEmailRequest(request: { email: string }): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.updateEmailRequest}`, request, { withCredentials: true });
  }

  updatePassword(request: UpdatePassword): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.updatePassword}`, request, { withCredentials: true });
  }

  logout(): Observable<WebResponse<string>> {
    return this.http.delete<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}`, { withCredentials: true });
  }

  userProfile$ = new BehaviorSubject<AuthResponse | null | undefined>(undefined);

  setUserProfile(data: any) {
    if(data) {
      this.userProfile$.next(data);
    } else {
      this.userProfile$.next(null);
    }
  }
}
