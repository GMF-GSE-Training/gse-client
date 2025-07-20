import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ViewAllComponent } from './view-all.component';

describe('ViewAllComponent', () => {
  let component: ViewAllComponent;
  let fixture: ComponentFixture<ViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
