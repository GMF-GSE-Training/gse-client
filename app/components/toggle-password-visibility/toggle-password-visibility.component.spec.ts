import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePasswordVisibilityComponent } from './toggle-password-visibility.component';

describe('TogglePasswordVisibilityComponent', () => {
  let component: TogglePasswordVisibilityComponent;
  let fixture: ComponentFixture<TogglePasswordVisibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TogglePasswordVisibilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TogglePasswordVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
