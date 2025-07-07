import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { ParticipantDetailComponent } from './participant-detail.component';

describe('ParticipantDetailComponent', () => {
  let component: ParticipantDetailComponent;
  let fixture: ComponentFixture<ParticipantDetailComponent>;

  beforeEach(async () => {
    // Mock localStorage
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user_profile') {
        return JSON.stringify({
          participant: { id: 'test-participant-id' },
          role: { name: 'Admin' }
        });
      }
      return null;
    });
    spyOn(window.localStorage, 'setItem');
    spyOn(window.localStorage, 'removeItem');

    await TestBed.configureTestingModule({
      imports: [ParticipantDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(), // Add actual HttpClient provider
        provideHttpClientTesting(),
        provideLocationMocks(),
        { 
          provide: ActivatedRoute, 
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ participantId: 'test-id' }),
              queryParams: {} // Pastikan snapshot juga memiliki queryParams jika diakses
            },
            paramMap: new BehaviorSubject(convertToParamMap({ participantId: 'test-id' })),
            queryParamMap: new BehaviorSubject(convertToParamMap({})),
            queryParams: new BehaviorSubject({}), // Ini yang utama untuk memperbaiki galat subscribe
            url: new BehaviorSubject([])
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
