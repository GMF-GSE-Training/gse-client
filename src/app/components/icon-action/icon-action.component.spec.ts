import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IconActionComponent } from './icon-action.component';

describe('IconActionComponent', () => {
  let component: IconActionComponent;
  let fixture: ComponentFixture<IconActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconActionComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
