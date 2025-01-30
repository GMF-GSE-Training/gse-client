import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapabilityFormComponent } from './capability-form.component';

describe('CapabilityFormComponent', () => {
  let component: CapabilityFormComponent;
  let fixture: ComponentFixture<CapabilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapabilityFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CapabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
