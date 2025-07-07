import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { EditCurriculumSyllabusComponent } from './edit-curriculum-syllabus.component';

describe('EditCurriculumSyllabusComponent', () => {
  let component: EditCurriculumSyllabusComponent;
  let fixture: ComponentFixture<EditCurriculumSyllabusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCurriculumSyllabusComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCurriculumSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
