import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordUpdateFormCardComponent } from './password-update-form-card.component';

describe('PasswordUpdateFormCardComponent', () => {
  let component: PasswordUpdateFormCardComponent;
  let fixture: ComponentFixture<PasswordUpdateFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordUpdateFormCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordUpdateFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
