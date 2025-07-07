import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { CurriculumSyllabusFormComponent } from './curriculum-syllabus-form.component';

describe('CurriculumSyllabusFormComponent', () => {
  let component: CurriculumSyllabusFormComponent;
  let fixture: ComponentFixture<CurriculumSyllabusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumSyllabusFormComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumSyllabusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
