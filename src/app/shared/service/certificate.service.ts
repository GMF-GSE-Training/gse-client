import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateCertificate, CertificateResponse } from "../model/certificate.model";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
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
    const endpoint = this.envService.getEndpoint('certificate', 'base');
    const url = this.envService.buildUrl(`${endpoint}/${certificateId}/pdf`);
    
    console.log('📁 Certificate Service: Getting PDF for certificate:', certificateId);
    console.log('📁 Certificate Service: Endpoint:', endpoint);
    console.log('📁 Certificate Service: Full URL:', url);
    console.log('📁 Certificate Service: Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl,
      backendUrl: this.envService.getBackendUrl()
    });
    
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      map(response => {
        console.log('📁 Certificate Service: HTTP Response received');
        console.log('📁 Certificate Service: Response status:', response.status);
        console.log('📁 Certificate Service: Response headers:', response.headers);
        console.log('📁 Certificate Service: Response body (blob):', response.body);
        console.log('📁 Certificate Service: Blob size:', response.body?.size);
        console.log('📁 Certificate Service: Blob type:', response.body?.type);
        
        if (!response.body) {
          throw new Error('No blob received from server');
        }
        
        if (response.body.size === 0) {
          throw new Error('Empty blob received from server');
        }
        
        return response.body;
      }),
      catchError(error => {
        console.error('❌ Certificate Service: Error getting PDF:', error);
        console.error('❌ Certificate Service: Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          body: error.error
        });
        throw error;
      })
    );
  }

  deleteCertificate(certificateId: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${certificateId}`);
    
    console.log('🗑️ Certificate Service Debug - Delete URL:', url);
    console.log('🗑️ Environment info:', {
      endpoint: this.envService.getEndpoint('certificate', 'base'),
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.delete<WebResponse<string>>(url, {
      withCredentials: true
    });
  }

  checkCertificateByParticipant(cotId: string, participantId: string): Observable<WebResponse<CertificateResponse | null>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/check/${cotId}/${participantId}`);
    
    console.log('🔍 Certificate Service Debug - Check URL:', url);
    
    return this.http.get<WebResponse<CertificateResponse | null>>(url, {
      withCredentials: true
    });
  }
}
