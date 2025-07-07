import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';

import { DisplaysSignatureFileComponent } from './displays-signature-file.component';

describe('DisplaysSignatureFileComponent', () => {
  let component: DisplaysSignatureFileComponent;
  let fixture: ComponentFixture<DisplaysSignatureFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaysSignatureFileComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplaysSignatureFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
