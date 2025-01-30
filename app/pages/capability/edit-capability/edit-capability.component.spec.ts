import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCapabilityComponent } from './edit-capability.component';

describe('EditCapabilityComponent', () => {
  let component: EditCapabilityComponent;
  let fixture: ComponentFixture<EditCapabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCapabilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCapabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
