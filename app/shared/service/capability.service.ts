import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CapabilityResponse, CreateCapability, UpdateCapability } from "../model/capability.model";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root',
})
export class CapabilityService {
  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.capability;

  constructor(
    private readonly http: HttpClient,
  ) { }

  createCapability(request: CreateCapability): Observable<WebResponse<CapabilityResponse>> {
    return this.http.post<WebResponse<CapabilityResponse>>(`${this.apiUrl}/${this.endpoint.base}`, request, { withCredentials: true });
  }

  getCapabilityById(id: string): Observable<WebResponse<CapabilityResponse>> {
    return this.http.get<WebResponse<CapabilityResponse>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
  }

  getCurriculumSyllabus(id: string): Observable<WebResponse<CapabilityResponse>> {
    return this.http.get<WebResponse<CapabilityResponse>>(`${this.apiUrl}/${this.endpoint.base}/${id}/curriculum-syllabus`, { withCredentials: true });
  }

  getAllCapability(): Observable<WebResponse<CapabilityResponse[]>> {
    return this.http.get<WebResponse<CapabilityResponse[]>>(`${this.apiUrl}/${this.endpoint.base}`, { withCredentials: true });
  }

  updateCapability(id: string, request: UpdateCapability): Observable<WebResponse<string>> {
    return this.http.patch<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, request, { withCredentials: true });
  }

  deleteCapability(id: string): Observable<WebResponse<string>> {
    return this.http.delete<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
  }

  listCapability(q?: string, page?: number, size?: number): Observable<WebResponse<CapabilityResponse[]>> {
    return this.http.get<WebResponse<CapabilityResponse[]>>(`${this.apiUrl}/${this.endpoint.list}?q=${q}&page=${page}&size=${size}`, { withCredentials: true });
  }
}
