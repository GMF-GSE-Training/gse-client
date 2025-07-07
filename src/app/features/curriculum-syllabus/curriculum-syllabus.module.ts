import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CurriculumSyllabusRoutingModule } from './curriculum-syllabus-routing.module';
import { AddCurriculumComponent } from './pages/add-curriculum/add-curriculum.component';
import { EditCurriculumSyllabusComponent } from './pages/edit-curriculum-syllabus/edit-curriculum-syllabus.component';
import { ViewCurriculumSyllabusComponent } from './pages/view-curriculum-syllabus/view-curriculum-syllabus.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurriculumSyllabusRoutingModule,
    // Import standalone components that are used in routes
    AddCurriculumComponent,
    EditCurriculumSyllabusComponent,
    ViewCurriculumSyllabusComponent
  ]
})
export class CurriculumSyllabusModule { }
