import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { CotResponse, CreateCot, UpdateCot } from "../model/cot.model";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root'
})
export class CotService {
  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.cot;

  constructor(
    private readonly http: HttpClient,
  ) { }

  createCot(request: CreateCot): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}`, request, { withCredentials: true });
  }

  getCotById(id: string): Observable<WebResponse<CotResponse>> {
    return this.http.get<WebResponse<CotResponse>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
  }

  updateCot(id: string, request: UpdateCot): Observable<WebResponse<string>> {
    return this.http.patch<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, request, { withCredentials: true });
  }

  deleteCot(id: string): Observable<WebResponse<string>> {
    return this.http.delete<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
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

    const url = `${this.apiUrl}/${this.endpoint.list}${params.toString() ? `?${params.toString()}` : ''}`;
    
    console.log('🔍 COT Service Debug - URL:', url);
    console.log('🔍 COT Service Debug - API URL:', this.apiUrl);
    console.log('🔍 COT Service Debug - Endpoint:', this.endpoint.list);
    
    return this.http.get<WebResponse<CotResponse[]>>(url, {
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