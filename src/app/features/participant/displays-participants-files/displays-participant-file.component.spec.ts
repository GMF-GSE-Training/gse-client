import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { DisplaysParticipantFilesComponent } from './displays-participant-file.component';

describe('DisplaysParticipantFilesComponent', () => {
  let component: DisplaysParticipantFilesComponent;
  let fixture: ComponentFixture<DisplaysParticipantFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaysParticipantFilesComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaysParticipantFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
