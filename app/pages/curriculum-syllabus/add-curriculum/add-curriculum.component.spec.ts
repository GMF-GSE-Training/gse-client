import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurriculumComponent } from './add-curriculum.component';

describe('AddCurriculumComponent', () => {
  let component: AddCurriculumComponent;
  let fixture: ComponentFixture<AddCurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCurriculumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
