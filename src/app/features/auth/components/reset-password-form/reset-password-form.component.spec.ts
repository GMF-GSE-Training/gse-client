import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { ResetPasswordFormComponent } from './reset-password-form.component';

describe('ResetPasswordFormComponent', () => {
  let component: ResetPasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordFormComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
