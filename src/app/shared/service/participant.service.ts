import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
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

  constructor(private readonly http: HttpClient) {}

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

  listParticipants(query: string, page: number, size: number, sortBy: string, sortOrder: string) {
    const params: any = { page, size };
    if (query) params.keyword = query;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    return this.http.get<{data:any[],paging:any,actions?:any}>(`/participants/list/result`, { params });
  }

  getFile({ id }: { id: string; }, fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/participants/${id}/${fileName}`, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  getFoto(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/participants/${id}/foto`, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  getQrCode(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${this.endpoints.base}/${id}/qr-code`, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  downloadIdCard(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${this.endpoints.base}/${id}/${this.endpoints.downloadIdCard}`, {
      withCredentials: true,
      responseType: 'blob',
    });
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download-id-card`, {
      withCredentials: true,
      responseType: 'blob',
    });
  }

  viewIdCard(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${this.endpoints.base}/${id}/${this.endpoints.idCard}`, {
      responseType: 'text',
      withCredentials: true,
    });
  }

  isDataComplete(id: string): Observable<WebResponse<boolean>> {
    return this.http.get<WebResponse<boolean>>(`${this.apiUrl}/${this.endpoints.isComplete}/${id}`, { withCredentials: true });
  }

  downloadAllFiles(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/participants/${id}/download-all`, {
      withCredentials: true,
      responseType: 'blob',
    });
  }
}