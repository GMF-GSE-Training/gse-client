import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { RoleResponse } from '../model/role.model';
import { WebResponse } from '../model/web.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints.role;

  constructor(
    private readonly http: HttpClient,
  ) { }

  getAllRoles(): Observable<WebResponse<RoleResponse[]>> {
    return this.http.get<WebResponse<RoleResponse[]>>(`${this.apiUrl}/${this.endpoints.base}`, { withCredentials: true });
  }
}
