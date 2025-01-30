import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CotResponse, CreateCot, UpdateCot } from "../model/cot.model";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root'
})
export class CotService {
  private apiUrl = environment.apiUrl;
  private endpoint = environment.endpoints.cot;

  constructor(
    private readonly http: HttpClient,
  ) { }

    createCot(request: CreateCot): Observable<WebResponse<string>> {
      return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}`, request, { withCredentials: true });
    }

    getCotById(id: string): Observable<WebResponse<CotResponse>> {
      return this.http.get<WebResponse<CotResponse>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
    }

    updateCot(id: string, request: UpdateCot): Observable<WebResponse<string>> {
      return this.http.patch<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, request, { withCredentials: true });
    }

    deleteCot(id: string): Observable<WebResponse<string>> {
      return this.http.delete<WebResponse<string>>(`${this.apiUrl}/${this.endpoint.base}/${id}`, { withCredentials: true });
    }

    listCot(q?: string, page?: number, size?: number, startDate?: string, endDate?: string): Observable<WebResponse<CotResponse[]>> {
      return this.http.get<WebResponse<CotResponse[]>>(`${this.apiUrl}/${this.endpoint.list}?q=${q}&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`, { withCredentials: true });
    }
}
