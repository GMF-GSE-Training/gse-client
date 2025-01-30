import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParticipantDataComponent } from './edit-participant-data.component';

describe('EditParticipantDataComponent', () => {
  let component: EditParticipantDataComponent;
  let fixture: ComponentFixture<EditParticipantDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditParticipantDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditParticipantDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
