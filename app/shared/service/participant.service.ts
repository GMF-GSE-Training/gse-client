import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ParticipantResponse } from "../model/participant.model";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints.participant;

  constructor(
    private readonly http: HttpClient,
  ) { }

  createParticipant(request: FormData): Observable<WebResponse<ParticipantResponse>> {
    return this.http.post<WebResponse<ParticipantResponse>>(`${this.apiUrl}/${this.endpoints.base}`, request, { withCredentials: true });
  }

  getParticipantById(id: string): Observable<WebResponse<ParticipantResponse>> {
    return this.http.get<WebResponse<ParticipantResponse>>(`${this.apiUrl}/${this.endpoints.base}/${id}`, { withCredentials: true });
  }

  updateParticipant(id: string, request: FormData): Observable<WebResponse<ParticipantResponse>> {
    return this.http.patch<WebResponse<ParticipantResponse>>(`${this.apiUrl}/${this.endpoints.base}/${id}`, request, { withCredentials: true });
  }

  deleteParticipant(id: string): Observable<WebResponse<ParticipantResponse>> {
    return this.http.delete<WebResponse<ParticipantResponse>>(`${this.apiUrl}/${this.endpoints.base}/${id}`, { withCredentials: true });
  }

  listParticipants(q?: string, page?: number, size?: number): Observable<WebResponse<ParticipantResponse>> {
    return this.http.get<WebResponse<ParticipantResponse>>(`${this.apiUrl}/${this.endpoints.list}?q=${q}&page=${page}&size=${size}`, { withCredentials: true });
  }

  getFile({ id }: { id: string; }, fileName: string): Observable<WebResponse<string>> {
    return this.http.get<WebResponse<string>>(`${this.apiUrl}/participants/${id}/${fileName}`, { withCredentials: true });
  }

  getFoto(id: string): Observable<WebResponse<string>> {
    return this.http.get<WebResponse<string>>(`${this.apiUrl}/participants/${id}/foto`, { withCredentials: true });
  }

  getQrCode(id: string): Observable<WebResponse<string>> {
    return this.http.get<WebResponse<string>>(`${this.apiUrl}/participants/${id}/qr-code`, { withCredentials: true });
  }

  downloadIdCard(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${this.endpoints.base}/${id}/${this.endpoints.downloadIdCard}`, {
      withCredentials: true,
      responseType: 'blob'
    });
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${this.endpoints.base}/${id}/${this.endpoints.downloadDocument}`, {
      withCredentials: true,
      responseType: 'blob'
    });
  }

  viewIdCard(id: string): Observable<string> {
      return this.http.get(`${this.apiUrl}/${this.endpoints.base}/${id}/${this.endpoints.idCard}`, {
          responseType: 'text', // Mengatur responseType ke 'text'
          withCredentials: true
      });
  }

  isDataComplete(id: string): Observable<WebResponse<boolean>> {
    return this.http.get<WebResponse<boolean>>(`${this.apiUrl}/${this.endpoints.isComplete}/${id}`, { withCredentials: true });
  }
}
