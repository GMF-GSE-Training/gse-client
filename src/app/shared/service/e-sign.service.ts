import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ESignResponse, UpdateESign } from "../model/e-sign.model";
import { Observable } from "rxjs";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root'
})
export class ESignService {
  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.eSign;

  constructor(
    private readonly http: HttpClient,
  ) { }

  createESign(request: FormData): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}`, request, { withCredentials: true });
  }

  getESignById(id: string): Observable<WebResponse<ESignResponse>> {
    return this.http.get<WebResponse<ESignResponse>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
  }

  updateESign(id: string, request: FormData): Observable<WebResponse<ESignResponse>> {
    return this.http.patch<WebResponse<ESignResponse>> (`${this.apiUrl}/${this.endpoint.base}/${id}`, request, { withCredentials: true });
  }

  getESignFile(id: string): Observable<WebResponse<string>> {
    return this.http.get<WebResponse<string>>(`${this.apiUrl}/e-sign/${id}/view`, { withCredentials: true });
  }

  deleteESign(id: string): Observable<WebResponse<string>> {
    return this.http.delete<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
  }

  listESign(q?: string, page?: number, size?: number, sortBy?: string, sortOrder?: string): Observable<WebResponse<ESignResponse[]>> {
    const params: any = { page, size };
    if (q) params.q = q;
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    return this.http.get<WebResponse<ESignResponse[]>>(`/e-sign/list/result`, { params, withCredentials: true });
  }
}
