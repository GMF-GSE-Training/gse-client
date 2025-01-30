import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { CreateCertificate } from "../model/certificate.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.certificate;

  constructor(
    private readonly http: HttpClient,
  ) { }

  createCertificate(cotId: string, participantId: string, request: CreateCertificate): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/${this.endpoint.base}/${cotId}/${participantId}`, request, {
      withCredentials: true,
      responseType: 'blob'
    });
  }
}
