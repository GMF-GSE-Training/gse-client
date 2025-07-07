import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ParticipantRoutingModule } from './participant-routing.module';
import { ParticipantListComponent } from './participant-list/participant-list.component';
import { AddParticipantDataComponent } from './add-participant-data/add-participant-data.component';
import { ParticipantDetailComponent } from './participant-detail/participant-detail.component';
import { EditParticipantDataComponent } from './edit-participant-data/edit-participant-data.component';
import { IdCardComponent } from './id-card/id-card.component';
import { DisplaysParticipantFilesComponent } from './displays-participants-files/displays-participant-file.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ParticipantRoutingModule,
    // Import standalone components that are used in routes
    ParticipantListComponent,
    AddParticipantDataComponent,
    ParticipantDetailComponent,
    EditParticipantDataComponent,
    IdCardComponent,
    DisplaysParticipantFilesComponent
  ]
})
export class ParticipantModule { }
