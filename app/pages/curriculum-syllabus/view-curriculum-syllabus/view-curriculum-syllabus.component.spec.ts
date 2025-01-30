import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurriculumSyllabusComponent } from './view-curriculum-syllabus.component';

describe('ViewCurriculumSyllabusComponent', () => {
  let component: ViewCurriculumSyllabusComponent;
  let fixture: ComponentFixture<ViewCurriculumSyllabusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCurriculumSyllabusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCurriculumSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
