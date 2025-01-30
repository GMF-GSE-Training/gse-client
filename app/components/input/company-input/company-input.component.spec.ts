import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInputComponent } from './company-input.component';

describe('CompanyInputComponent', () => {
  let component: CompanyInputComponent;
  let fixture: ComponentFixture<CompanyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
