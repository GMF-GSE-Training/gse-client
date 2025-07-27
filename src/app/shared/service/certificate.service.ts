import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CreateCertificate } from "../model/certificate.model";
import { Observable } from "rxjs";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.certificate;

  constructor(
    private readonly http: HttpClient,
  ) { }

  createCertificate(cotId: string, participantId: string, request: CreateCertificate): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${cotId}/${participantId}`, request, { withCredentials: true});
  }
}
