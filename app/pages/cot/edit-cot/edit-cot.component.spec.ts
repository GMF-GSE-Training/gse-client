import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCotComponent } from './edit-cot.component';

describe('EditCotComponent', () => {
  let component: EditCotComponent;
  let fixture: ComponentFixture<EditCotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
