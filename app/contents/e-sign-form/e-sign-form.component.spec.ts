import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignFormComponent } from './e-sign-form.component';

describe('ESignFormComponent', () => {
  let component: ESignFormComponent;
  let fixture: ComponentFixture<ESignFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ESignFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ESignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
