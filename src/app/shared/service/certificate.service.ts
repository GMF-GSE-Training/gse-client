import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreateCertificate } from "../model/certificate.model";
import { Observable } from "rxjs";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: 'root',
})
export class CertificateService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  createCertificate(cotId: string, participantId: string, request: CreateCertificate): Observable<Blob> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('certificate', 'base')}/${cotId}/${participantId}`);
    
    console.log('🔍 Certificate Service Debug - URL:', url);
    console.log('🔍 Certificate Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.post(url, request, {
      withCredentials: true,
      responseType: 'blob'
    });
  }
}
