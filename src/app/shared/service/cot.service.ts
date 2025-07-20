import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { CotResponse, CreateCot, UpdateCot } from "../model/cot.model";
import { WebResponse } from "../model/web.model";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: 'root'
})
export class CotService {
  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  createCot(request: CreateCot): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('cot', 'base'));
    return this.http.post<WebResponse<string>>(url, request, { withCredentials: true });
  }

  getCotById(id: string): Observable<WebResponse<CotResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('cot', 'base')}/${id}`);
    return this.http.get<WebResponse<CotResponse>>(url, { withCredentials: true });
  }

  updateCot(id: string, request: UpdateCot): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('cot', 'base')}/${id}`);
    return this.http.patch<WebResponse<string>>(url, request, { withCredentials: true });
  }

  deleteCot(id: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('cot', 'base')}/${id}`);
    return this.http.delete<WebResponse<string>>(url, { withCredentials: true });
  }

  listCot(
    q?: string,
    page?: number,
    size?: number,
    startDate?: string,
    endDate?: string,
    sortBy?: string,
    sortOrder?: string,
    options?: { headers?: HttpHeaders }
  ): Observable<WebResponse<CotResponse[]>> {
    
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (sortBy) params.append('sort_by', sortBy);
    if (sortOrder) params.append('sort_order', sortOrder);

    const endpoint = this.envService.getEndpoint('cot', 'list');
    const url = this.envService.buildUrl(endpoint);
    const fullUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
    
    console.log('🔍 COT Service Debug - URL:', fullUrl);
    console.log('🔍 COT Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<WebResponse<CotResponse[]>>(fullUrl, {
      withCredentials: true,
      ...options
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('🔍 COT Service Error:', error);
        if (error.status === 200 && error.error && typeof error.error === 'string' && error.error.includes('<!doctype')) {
          console.error('🔍 Server returned HTML instead of JSON. Possible authentication or routing issue.');
          return throwError(() => new Error('Server returned HTML instead of JSON. Please check authentication or try refreshing the page.'));
        }
        return throwError(() => error);
      })
    );
  }
}