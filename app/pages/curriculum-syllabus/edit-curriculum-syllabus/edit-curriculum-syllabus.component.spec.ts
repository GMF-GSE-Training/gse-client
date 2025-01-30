import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurriculumSyllabusComponent } from './edit-curriculum-syllabus.component';

describe('EditCurriculumSyllabusComponent', () => {
  let component: EditCurriculumSyllabusComponent;
  let fixture: ComponentFixture<EditCurriculumSyllabusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCurriculumSyllabusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCurriculumSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
