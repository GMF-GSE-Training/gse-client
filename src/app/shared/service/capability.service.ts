import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CapabilityResponse, CreateCapability, UpdateCapability } from "../model/capability.model";
import { WebResponse } from "../model/web.model";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: 'root',
})
export class CapabilityService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  createCapability(request: CreateCapability): Observable<WebResponse<CapabilityResponse>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('capability', 'base'));
    return this.http.post<WebResponse<CapabilityResponse>>(url, request, { withCredentials: true });
  }

  getCapabilityById(id: string): Observable<WebResponse<CapabilityResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('capability', 'base')}/${id}`);
    return this.http.get<WebResponse<CapabilityResponse>>(url, { withCredentials: true });
  }

  getCurriculumSyllabus(id: string): Observable<WebResponse<CapabilityResponse>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('capability', 'base')}/${id}/curriculum-syllabus`);
    return this.http.get<WebResponse<CapabilityResponse>>(url, { withCredentials: true });
  }

  getAllCapability(): Observable<WebResponse<CapabilityResponse[]>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('capability', 'base'));
    return this.http.get<WebResponse<CapabilityResponse[]>>(url, { withCredentials: true });
  }

  updateCapability(id: string, request: UpdateCapability): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('capability', 'base')}/${id}`);
    return this.http.patch<WebResponse<string>>(url, request, { withCredentials: true });
  }

  deleteCapability(id: string): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('capability', 'base')}/${id}`);
    return this.http.delete<WebResponse<string>>(url, { withCredentials: true });
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
    if (q) params.q = q;
    params.sort_by = sortBy || 'ratingCode';
    params.sort_order = sortOrder || 'asc';
    
    const url = this.envService.buildUrl(this.envService.getEndpoint('capability', 'list'));
    
    console.log('🔍 Capability Service Debug - URL:', url);
    console.log('🔍 Capability Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.get<WebResponse<CapabilityResponse[]>>(url, { params, withCredentials: true });
  }
}
