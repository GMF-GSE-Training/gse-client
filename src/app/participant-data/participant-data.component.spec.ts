import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDataComponent } from './participant-data.component';

describe('ParticipantDataComponent', () => {
  let component: ParticipantDataComponent;
  let fixture: ComponentFixture<ParticipantDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

