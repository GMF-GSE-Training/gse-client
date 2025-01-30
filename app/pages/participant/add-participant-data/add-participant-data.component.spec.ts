import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParticipantDataComponent } from './add-participant-data.component';

describe('AddParticipantDataComponent', () => {
  let component: AddParticipantDataComponent;
  let fixture: ComponentFixture<AddParticipantDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddParticipantDataComponent]
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
