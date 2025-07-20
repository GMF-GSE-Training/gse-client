import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ESignResponse, UpdateESign } from "../model/e-sign.model";
import { Observable } from "rxjs";
import { WebResponse } from "../model/web.model";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: 'root'
})
export class ESignService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  createESign(request: FormData): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('eSign', 'base'));
    return this.http.post<WebResponse<string>>(url, request, { withCredentials: true });
  }

  getESignById(id: string): Observable<WebResponse<ESignResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('eSign', 'base')}/${id}`);
    return this.http.get<WebResponse<ESignResponse>>(url, { withCredentials: true });
  }

  updateESign(id: string, request: FormData): Observable<WebResponse<ESignResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('eSign', 'base')}/${id}`);
    return this.http.patch<WebResponse<ESignResponse>>(url, request, { withCredentials: true });
  }

  getESignFile(id: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`e-sign/${id}/view`);
    return this.http.get<WebResponse<string>>(url, { withCredentials: true });
  }

  deleteESign(id: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('eSign', 'base')}/${id}`);
    return this.http.delete<WebResponse<string>>(url, { withCredentials: true });
  }

  listESign(q?: string, page?: number, size?: number, sortBy?: string, sortOrder?: string): Observable<WebResponse<ESignResponse[]>> {
    const params: any = { page, size };
    if (q) params.q = q;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    
    const url = this.envService.buildUrl(this.envService.getEndpoint('eSign', 'list'));
    
    console.log('🔍 E-Sign Service Debug - URL:', url);
    console.log('🔍 E-Sign Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<WebResponse<ESignResponse[]>>(url, { params, withCredentials: true });
  }
}
