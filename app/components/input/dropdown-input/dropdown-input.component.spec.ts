import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownInputComponent } from './dropdown-input.component';

describe('DropdownInputComponent', () => {
  let component: DropdownInputComponent;
  let fixture: ComponentFixture<DropdownInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
