import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateFormComponent } from './certificate-form.component';

describe('CertificateFormComponent', () => {
  let component: CertificateFormComponent;
  let fixture: ComponentFixture<CertificateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateFormComponent]
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
