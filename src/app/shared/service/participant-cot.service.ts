import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ParticipantResponse } from '../model/participant.model';
import {
  addParticipantToCot,
  ListParticipantCotResponse,
  AddParticipantResponse,
} from '../model/participant-cot.model';
import { WebResponse } from '../model/web.model';

@Injectable({
  providedIn: 'root',
})
export class ParticipantCotService {
  constructor(private readonly http: HttpClient) {}

  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.participantCot;

  getUnregisteredParticipants(
    cotId: string,
    searchQuery?: string,
    page?: number,
    size?: number,
  ): Observable<WebResponse<ParticipantResponse[]>> {
    return this.http.get<WebResponse<ParticipantResponse[]>>(
      `${this.apiUrl}/${this.endpoint.getUnregisteredParticipants}/${cotId}?q=${searchQuery}&page=${page}&size=${size}`,
      { withCredentials: true },
    );
  }

  addParticipantToCot(
    cotId: string,
    participantIds: addParticipantToCot,
  ): Observable<WebResponse<AddParticipantResponse>> {
    return this.http.post<WebResponse<AddParticipantResponse>>(
      `${this.apiUrl}/${this.endpoint.base}/${cotId}`,
      participantIds,
      { withCredentials: true },
    );
  }

  deleteParticipantFromCot(
    cotId: string,
    participantId: string,
  ): Observable<WebResponse<string>> {
    return this.http.delete<WebResponse<string>>(
      `${this.apiUrl}/${this.endpoint.base}/${cotId}/${participantId}`,
      { withCredentials: true },
    );
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

    return this.http.get<WebResponse<ListParticipantCotResponse>>(
      `${this.apiUrl}/${this.endpoint.base}/${cotId}/${this.endpoint.list}?${params.toString()}`,
      { withCredentials: true },
    );
  }
}
