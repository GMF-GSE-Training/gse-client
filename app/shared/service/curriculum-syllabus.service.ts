import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";
import { CreateCurriculumSyllabus, UpdateCurriculumSyllabus } from "../model/curriculum-syllabus.model";
import { WebResponse } from "../model/web.model";

@Injectable({
  providedIn: 'root'
})
export class CurriculumSyllabusService {
  constructor(
    private readonly http: HttpClient,
  ) { }

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints.curriculumSyllabus;

  createCurriculumSyllabus(request: CreateCurriculumSyllabus): Observable<WebResponse<string>> {
    return this.http.post<WebResponse<string>>(`${this.apiUrl}/${this.endpoints.base}`, request, { withCredentials: true });
  }

  updateCurriculumSyllabus(capabilityId: string, request: UpdateCurriculumSyllabus): Observable<WebResponse<string>> {
    return this.http.patch<WebResponse<string>>(`${this.apiUrl}/${this.endpoints.base}/${capabilityId}`, request, { withCredentials: true });
  }
}
