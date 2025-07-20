import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, User, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  createUser(request: CreateUserRequest): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('user', 'base'));
    return this.http.post<WebResponse<string>>(url, request, { withCredentials: true });
  }

  get(id: string): Observable<WebResponse<UserResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('user', 'base')}/${id}`);
    return this.http.get<WebResponse<UserResponse>>(url, { withCredentials: true });
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('user', 'base')}/${id}`);
    return this.http.patch<WebResponse<string>>(url, request, { withCredentials: true });
  }

  listUsers(q?: string, page?: number, size?: number, sortBy?: string, sortOrder?: string): Observable<WebResponse<UserResponse[]>> {
    const params: any = { page, size };
    if (q) params.keyword = q;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    
    const url = this.envService.buildUrl(this.envService.getEndpoint('user', 'list'));
    
    console.log('🔍 User Service Debug - URL:', url);
    console.log('🔍 User Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<WebResponse<UserResponse[]>>(url, { params, withCredentials: true });
  }

  deleteUser(id: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('user', 'base')}/${id}`);
    return this.http.delete<WebResponse<string>>(url, { withCredentials: true });
  }
}
