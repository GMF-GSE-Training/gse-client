import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCapabilityDataComponent } from './add-capability-data.component';

describe('AddCapabilityDataComponent', () => {
  let component: AddCapabilityDataComponent;
  let fixture: ComponentFixture<AddCapabilityDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCapabilityDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCapabilityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
