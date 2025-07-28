import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebResponse } from '../model/web.model';
import { DashboardStatsResponse } from '../model/dashboard.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly environmentService: EnvironmentService
  ) {
    this.baseUrl = this.environmentService.getBackendUrl();
  }

  getDashboardStats(year?: number): Observable<WebResponse<DashboardStatsResponse>> {
    const params: { [key: string]: string } = {};
    if (year) {
      params['year'] = year.toString();
    }
    
    return this.http.get<WebResponse<DashboardStatsResponse>>(
      `${this.baseUrl}/cot/dashboard-stats`,
      { params }
    );
  }
}
