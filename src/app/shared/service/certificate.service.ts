import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateCertificate, CertificateResponse } from "../model/certificate.model";
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

  createCertificate(cotId: string, participantId: string, request: CreateCertificate): Observable<WebResponse<any>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${cotId}/${participantId}`);
    
    console.log('🔍 Certificate Service Debug - URL:', url);
    console.log('🔍 Certificate Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.post<WebResponse<any>>(url, request, {
      withCredentials: true
    });
  }

  getCertificateById(certificateId: string): Observable<WebResponse<CertificateResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${certificateId}`);
    
    return this.http.get<WebResponse<CertificateResponse>>(url, {
      withCredentials: true
    });
  }

  getCertificateFile(certificateId: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${certificateId}/view`);
    
    return this.http.get<WebResponse<string>>(url, {
      withCredentials: true
    });
  }

  getCertificatePdf(certificateId: string): Observable<Blob> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${certificateId}/pdf`);
    
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true
    });
  }
}
