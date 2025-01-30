import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaysParticipantFilesComponent } from './displays-participant-file.component';

describe('DisplaysParticipantFilesComponent', () => {
  let component: DisplaysParticipantFilesComponent;
  let fixture: ComponentFixture<DisplaysParticipantFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaysParticipantFilesComponent]
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
