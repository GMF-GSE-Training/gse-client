import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { AddParticipantDataComponent } from './add-participant-data.component';

describe('AddParticipantDataComponent', () => {
  let component: AddParticipantDataComponent;
  let fixture: ComponentFixture<AddParticipantDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddParticipantDataComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddParticipantDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
