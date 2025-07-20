import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateCurriculumSyllabus, UpdateCurriculumSyllabus } from "../model/curriculum-syllabus.model";
import { WebResponse } from "../model/web.model";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: 'root'
})
export class CurriculumSyllabusService {

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvironmentService,
  ) { }

  createCurriculumSyllabus(request: CreateCurriculumSyllabus): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(this.envService.getEndpoint('curriculumSyllabus', 'base'));
    
    console.log('🔍 Curriculum Syllabus Service Debug - URL:', url);
    console.log('🔍 Curriculum Syllabus Service Debug - Environment:', {
      isDevelopment: this.envService.isDevelopment,
      apiUrl: this.envService.apiUrl
    });
    
    return this.http.post<WebResponse<string>>(url, request, { withCredentials: true });
  }

  updateCurriculumSyllabus(capabilityId: string, request: UpdateCurriculumSyllabus): Observable<WebResponse<string>> {
    const url = this.envService.buildUrl(`${this.envService.getEndpoint('curriculumSyllabus', 'base')}/${capabilityId}`);
    return this.http.patch<WebResponse<string>>(url, request, { withCredentials: true });
  }
}
