import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { ViewCurriculumSyllabusComponent } from './view-curriculum-syllabus.component';

describe('ViewCurriculumSyllabusComponent', () => {
  let component: ViewCurriculumSyllabusComponent;
  let fixture: ComponentFixture<ViewCurriculumSyllabusComponent>;

  beforeEach(async () => {
    // Mock localStorage
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user_profile') {
        return JSON.stringify({ role: { name: 'Admin' } });
      }
      return null;
    });
    spyOn(window.localStorage, 'setItem');
    spyOn(window.localStorage, 'removeItem');

    await TestBed.configureTestingModule({
      imports: [ViewCurriculumSyllabusComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCurriculumSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
