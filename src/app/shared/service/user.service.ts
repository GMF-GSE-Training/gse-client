import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateUserRequest, UpdateUserRequest, User, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints.user;

  constructor(
    private readonly http: HttpClient,
  ) { }

  createUser(request: CreateUserRequest): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoints.base}`, request, { withCredentials: true });
  }

  get(id: string): Observable<WebResponse<UserResponse>> {
    return this.http.get<WebResponse<UserResponse>>(`${this.apiUrl}/${this.endpoints.base}/${id}`, { withCredentials: true });
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<WebResponse<string>> {
    return this.http.patch<WebResponse<string>>(`${this.apiUrl}/${this.endpoints.base}/${id}`, request, { withCredentials: true });
  }

  listUsers(q?: string, page?: number, size?: number, sortBy?: string, sortOrder?: string): Observable<WebResponse<UserResponse[]>> {
    const params: any = { page, size };
    if (q) params.keyword = q;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    return this.http.get<WebResponse<UserResponse[]>>(`/users/list/result`, { params, withCredentials: true });
  }

  deleteUser(id: string): Observable<WebResponse<string>> {
    return this.http.delete<WebResponse<string>>(`${this.apiUrl}/${this.endpoints.base}/${id}`, { withCredentials: true });
  }
}
