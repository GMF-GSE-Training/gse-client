import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { EditCertificateComponent } from './edit-certificate.component';

describe('EditCertificateComponent', () => {
  let component: EditCertificateComponent;
  let fixture: ComponentFixture<EditCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCertificateComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

