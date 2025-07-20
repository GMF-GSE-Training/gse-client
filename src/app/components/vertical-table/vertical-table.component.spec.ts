import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { VerticalTableComponent } from './vertical-table.component';

describe('VerticalTableComponent', () => {
  let component: VerticalTableComponent;
  let fixture: ComponentFixture<VerticalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalTableComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
