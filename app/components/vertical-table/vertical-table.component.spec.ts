import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalTableComponent } from './vertical-table.component';

describe('VerticalTableComponent', () => {
  let component: VerticalTableComponent;
  let fixture: ComponentFixture<VerticalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalTableComponent]
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
