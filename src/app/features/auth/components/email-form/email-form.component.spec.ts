import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { CAPTCHA_CONFIG } from 'ng-hcaptcha';

import { EmailFormComponent } from './email-form.component';

describe('EmailFormComponent', () => {
  let component: EmailFormComponent;
  let fixture: ComponentFixture<EmailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailFormComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: CAPTCHA_CONFIG, useValue: { siteKey: 'dummy' } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
