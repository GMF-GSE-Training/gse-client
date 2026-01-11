import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { DisplaysCertificateFileComponent } from './displays-certificate-file.component';

describe('DisplaysCertificateFileComponent', () => {
  let component: DisplaysCertificateFileComponent;
  let fixture: ComponentFixture<DisplaysCertificateFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaysCertificateFileComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaysCertificateFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

