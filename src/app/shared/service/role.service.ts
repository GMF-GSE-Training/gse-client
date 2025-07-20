import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleResponse } from '../model/role.model';
import { WebResponse } from '../model/web.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  getAllRoles(): Observable<WebResponse<RoleResponse[]>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('role', 'base'));
    
    console.log('🔍 Role Service Debug - URL:', url);
    console.log('🔍 Role Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<WebResponse<RoleResponse[]>>(url, { withCredentials: true });
  }
}
