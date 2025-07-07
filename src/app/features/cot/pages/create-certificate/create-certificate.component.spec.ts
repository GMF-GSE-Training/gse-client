import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { CreateCertificateComponent } from './create-certificate.component';

describe('CreateCertificateComponent', () => {
  let component: CreateCertificateComponent;
  let fixture: ComponentFixture<CreateCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCertificateComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
