import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFormCardComponent } from './email-form-card.component';

describe('EmailFormCardComponent', () => {
  let component: EmailFormCardComponent;
  let fixture: ComponentFixture<EmailFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailFormCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
