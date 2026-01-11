import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateCertificate, UpdateCertificate, Certificate } from "../model/certificate.model";
import { Observable } from "rxjs";
import { EnvironmentService } from "./environment.service";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root',
})
export class CertificateService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  createCertificate(cotId: string, participantId: string, request: CreateCertificate): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${cotId}/${participantId}`);
    
    console.log('🔍 Certificate Service Debug - URL:', url);
    console.log('🔍 Certificate Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.post<WebResponse<string>>(url, request, {
      withCredentials: true
    });
  }

  listCertificates(q?: string, page?: number, size?: number, sortBy?: string, sortOrder?: string): Observable<WebResponse<Certificate[]>> {
    const params: any = {};
    if (q) params.q = q;
    if (page) params.page = page;
    if (size) params.size = size;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    
    const url = this.envService.buildUrl(this.envService.getEndpoint('certificate', 'list'));
    
    console.log('🔍 Certificate Service Debug - URL:', url);
    console.log('🔍 Certificate Service Debug - Params:', params);
    
    return this.http.get<WebResponse<Certificate[]>>(url, { params, withCredentials: true });
  }

  deleteCertificate(id: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${id}`);
    return this.http.delete<WebResponse<string>>(url, { withCredentials: true });
  }

  viewFile(certificateId: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${certificateId}/view`);
    return this.http.get<WebResponse<string>>(url, { withCredentials: true });
  }

  getCertificateById(id: string): Observable<WebResponse<Certificate>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${id}`);
    return this.http.get<WebResponse<Certificate>>(url, { withCredentials: true });
  }

  updateCertificate(id: string, request: UpdateCertificate): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${id}`);
    return this.http.put<WebResponse<string>>(url, request, { withCredentials: true });
  }
}
