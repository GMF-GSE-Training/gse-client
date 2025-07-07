import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapabilityRoutingModule } from './capability-routing.module';

import { CapabilityListComponent } from './capability-list/capability-list.component';
import { AddCapabilityComponent } from './add-capability/add-capability.component';
import { EditCapabilityComponent } from './edit-capability/edit-capability.component';


@NgModule({
  imports: [
    CommonModule,
    CapabilityRoutingModule,
    CapabilityListComponent,
    AddCapabilityComponent,
    EditCapabilityComponent,
  ]
})
export class CapabilityModule { }
