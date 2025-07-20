import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
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

  /**
   * Mendapatkan list capability dengan dukungan sorting universal.
   * @param q Query pencarian
   * @param page Halaman
   * @param size Jumlah per halaman
   * @param sortBy Kolom untuk sorting (default: ratingCode)
   * @param sortOrder Urutan sorting (asc/desc, default: asc)
   */
  listCapability(q?: string, page?: number, size?: number, sortBy?: string, sortOrder?: string): Observable<WebResponse<CapabilityResponse[]>> {
    const params: any = { page, size };
    if (q) params.keyword = q;
    params.sort_by = sortBy || 'ratingCode';
    params.sort_order = sortOrder || 'asc';
    return this.http.get<WebResponse<CapabilityResponse[]>>(`/capability/list/result`, { params, withCredentials: true });
  }
}
