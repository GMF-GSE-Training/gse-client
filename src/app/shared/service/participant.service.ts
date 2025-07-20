import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ParticipantResponse } from "../model/participant.model";
import { WebResponse } from "../model/web.model";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) {}

  createParticipant(request: FormData): Observable<WebResponse<ParticipantResponse>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('participant', 'base'));
    return this.http.post<WebResponse<ParticipantResponse>>(url, request, { withCredentials: true });
  }

  getParticipantById(id: string): Observable<WebResponse<ParticipantResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participant', 'base')}/${id}`);
    return this.http.get<WebResponse<ParticipantResponse>>(url, { withCredentials: true });
  }

  updateParticipant(id: string, request: FormData): Observable<WebResponse<ParticipantResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participant', 'base')}/${id}`);
    return this.http.patch<WebResponse<ParticipantResponse>>(url, request, { withCredentials: true });
  }

  deleteParticipant(id: string): Observable<WebResponse<ParticipantResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participant', 'base')}/${id}`);
    return this.http.delete<WebResponse<ParticipantResponse>>(url, { withCredentials: true });
  }

  listParticipants(query: string, page: number, size: number, sortBy: string, sortOrder: string) {
    const params: any = { page, size };
    if (query) params.keyword = query;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    
    const url = this.envService.buildUrl(this.envService.getEndpoint('participant', 'list'));
    
    console.log('🔍 Participant Service Debug - URL:', url);
    console.log('🔍 Participant Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<{data:any[],paging:any,actions?:any}>(url, { params });
  }

  getFile({ id }: { id: string; }, fileName: string): Observable<Blob> {
    const url = this.envService.buildUrl(`participants/${id}/${fileName}`);
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  getFoto(id: string): Observable<Blob> {
    const url = this.envService.buildUrl(`participants/${id}/foto`);
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  getQrCode(id: string): Observable<Blob> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participant', 'base')}/${id}/qr-code`);
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  downloadIdCard(id: string): Observable<Blob> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participant', 'base')}/${id}/${this.envService.getEndpoint('participant', 'downloadIdCard')}`);
    return this.http.get(url, {
      withCredentials: true,
      responseType: 'blob',
    });
  }

  downloadDocument(id: string): Observable<Blob> {
    const url = this.envService.buildUrl(`${id}/download-id-card`);
    return this.http.get(url, {
      withCredentials: true,
      responseType: 'blob',
    });
  }

  viewIdCard(id: string): Observable<string> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participant', 'base')}/${id}/${this.envService.getEndpoint('participant', 'idCard')}`);
    return this.http.get(url, {
      responseType: 'text',
      withCredentials: true,
    });
  }

  isDataComplete(id: string): Observable<WebResponse<boolean>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participant', 'isComplete')}/${id}`);
    return this.http.get<WebResponse<boolean>>(url, { withCredentials: true });
  }

  downloadAllFiles(id: string): Observable<Blob> {
    const url = this.envService.buildUrl(`participants/${id}/download-all`);
    return this.http.get(url, {
      withCredentials: true,
      responseType: 'blob',
    });
  }
}