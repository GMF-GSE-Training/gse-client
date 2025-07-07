import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { CapabilityFormComponent } from './capability-form.component';

describe('CapabilityFormComponent', () => {
  let component: CapabilityFormComponent;
  let fixture: ComponentFixture<CapabilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapabilityFormComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
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
