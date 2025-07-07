import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFilterComponent],
      providers: [provideRouter([]), provideLocationMocks()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
