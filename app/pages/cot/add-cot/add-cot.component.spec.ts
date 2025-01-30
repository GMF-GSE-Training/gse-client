import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCotComponent } from './add-cot.component';

describe('AddCotComponent', () => {
  let component: AddCotComponent;
  let fixture: ComponentFixture<AddCotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
