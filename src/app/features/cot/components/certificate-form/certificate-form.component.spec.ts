import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { CertificateFormComponent } from './certificate-form.component';

describe('CertificateFormComponent', () => {
  let component: CertificateFormComponent;
  let fixture: ComponentFixture<CertificateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateFormComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
