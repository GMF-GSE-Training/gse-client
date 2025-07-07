import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { CAPTCHA_CONFIG } from 'ng-hcaptcha';

import { AccountVerificationComponent } from './account-verification.component';

describe('AccountVerificationComponent', () => {
  let component: AccountVerificationComponent;
  let fixture: ComponentFixture<AccountVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountVerificationComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CAPTCHA_CONFIG, useValue: { siteKey: 'dummy' } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
