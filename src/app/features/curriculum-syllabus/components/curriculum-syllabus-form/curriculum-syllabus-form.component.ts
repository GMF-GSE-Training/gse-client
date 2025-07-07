import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TitleComponent } from "../../../../components/title/title.component";
import { BaseInputComponent } from "../../../../components/input/base-input/base-input.component";
import { WhiteButtonComponent } from "../../../../components/button/white-button/white-button.component";
import { BlueButtonComponent } from "../../../../components/button/blue-button/blue-button.component";
import { FormsModule, NgForm } from '@angular/forms';
import { Capability } from '../../../../shared/model/capability.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoleBasedAccessDirective } from '../../../../shared/directive/role-based-access.directive';
import { HeaderComponent } from "../../../../components/header/header.component";

@Component({
  selector: 'app-curriculum-syllabus-form',
  standalone: true,
  imports: [
    TitleComponent,
    BaseInputComponent,
    WhiteButtonComponent,
    BlueButtonComponent,
    FormsModule,
    CommonModule,
    RouterLink,
    RoleBasedAccessDirective,
    HeaderComponent
],
  templateUrl: './curriculum-syllabus-form.component.html',
  styleUrl: './curriculum-syllabus-form.component.css'
})
export class CurriculumSyllabusFormComponent {
  @Input() pageTitle: string = '';
  @Input() capability: Capability = {
    id: '',
    ratingCode: '',
    trainingCode: '',
    trainingName: ''
  };

  @Input() regulasiGSEs: Array<{ capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string }> = [{
    capabilityId: this.capability.id,
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: 'Regulasi GSE'
  }];

  @Input() kompetensis: Array<{ capabilityId: string; name: string; theoryDuration: number; practiceDuration: number; type: string }> = [{
    capabilityId: this.capability.id,
    name: '',
    theoryDuration: 0,
    practiceDuration: 0,
    type: 'Kompetensi'
  }];

  @Input() isView: boolean = false;
  @Input() blueButtonRoute: string = '';

  @Output() formSubmit = new EventEmitter<any>();
  @ViewChild('form') form!: NgForm;

  handleSubmit(event: Event) {
    event.preventDefault();

    if (this.form.valid) {
      this.formSubmit.emit();
    }
  }

  addInput(groupName: 'regulasiGSEs' | 'kompetensis') {
    const newItem = {
      capabilityId: this.capability.id,
      name: '',
      theoryDuration: 0,
      practiceDuration: 0,
      type: groupName === 'regulasiGSEs' ? 'Regulasi GSE' : 'Kompetensi'
    };

    this[groupName].push(newItem);
  }

  deleteInput(groupName: 'regulasiGSEs' | 'kompetensis', index: number) {
    this[groupName].splice(index, 1);
  }
}
