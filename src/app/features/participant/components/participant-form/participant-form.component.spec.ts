import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { ParticipantFormComponent } from './participant-form.component';

describe('ParticipantFormComponent', () => {
  let component: ParticipantFormComponent;
  let fixture: ComponentFixture<ParticipantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantFormComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({
      role: { name: 'mockRole' }
    }));
    
    fixture = TestBed.createComponent(ParticipantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});