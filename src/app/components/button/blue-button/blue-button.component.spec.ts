import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BlueButtonComponent } from './blue-button.component';

describe('BlueButtonComponent', () => {
  let component: BlueButtonComponent;
  let fixture: ComponentFixture<BlueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlueButtonComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlueButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
