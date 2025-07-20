import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParticipantResponse } from '../model/participant.model';
import {
  addParticipantToCot,
  ListParticipantCotResponse,
  AddParticipantResponse,
} from '../model/participant-cot.model';
import { WebResponse } from '../model/web.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipantCotService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) {}

  getUnregisteredParticipants(
    cotId: string,
    searchQuery?: string,
    page?: number,
    size?: number,
  ): Observable<WebResponse<ParticipantResponse[]>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participantCot', 'getUnregisteredParticipants')}/${cotId}?q=${searchQuery}&page=${page}&size=${size}`);
    
    console.log('🔍 Participant COT Service Debug - URL:', url);
    console.log('🔍 Participant COT Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<WebResponse<ParticipantResponse[]>>(url, { withCredentials: true });
  }

  addParticipantToCot(
    cotId: string,
    participantIds: addParticipantToCot,
  ): Observable<WebResponse<AddParticipantResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participantCot', 'base')}/${cotId}`);
    return this.http.post<WebResponse<AddParticipantResponse>>(url, participantIds, { withCredentials: true });
  }

  deleteParticipantFromCot(
    cotId: string,
    participantId: string,
  ): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('participantCot', 'base')}/${cotId}/${participantId}`);
    return this.http.delete<WebResponse<string>>(url, { withCredentials: true });
  }

  listParticipantCot(
    cotId: string,
    q?: string,
    page?: number,
    size?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ): Observable<WebResponse<ListParticipantCotResponse>> {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());
    if (sortBy) params.append('sort_by', sortBy);
    if (sortOrder) params.append('sort_order', sortOrder);

    const baseEndpoint = this.envService.getEndpoint('participantCot', 'base');
    const listEndpoint = this.envService.getEndpoint('participantCot', 'list');
    const url = this.envService.buildUrl(`${baseEndpoint}/${cotId}/${listEndpoint}?${params.toString()}`);
    
    console.log('🔍 Participant COT List Service Debug - URL:', url);
    console.log('🔍 Participant COT List Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<WebResponse<ListParticipantCotResponse>>(url, { withCredentials: true });
  }
}
