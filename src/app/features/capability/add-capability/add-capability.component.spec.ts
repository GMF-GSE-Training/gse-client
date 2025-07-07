import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { AddCapabilityComponent } from './add-capability.component';

describe('AddCapabilityComponent', () => {
  let component: AddCapabilityComponent;
  let fixture: ComponentFixture<AddCapabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCapabilityComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCapabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
