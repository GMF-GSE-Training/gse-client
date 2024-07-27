import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewParticipantDataComponent } from './pages/view-participant-data/view-participant-data.component';
import { ViewCapabilityComponent } from './pages/view-capability/view-capability.component';
import { AddParticipantDataComponent } from './pages/add-participant-data/add-participant-data.component';
import { DetailParticipantDataComponent } from './pages/detail-participant-data/detail-participant-data.component';
import { AddCapabilityDataComponent } from './pages/add-capability-data/add-capability-data.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'participant-data',
    component: ViewParticipantDataComponent
  },
  {
    path: 'capability',
    component: ViewCapabilityComponent
  },
  {
    path: 'add-participant-data',
    component: AddParticipantDataComponent
  },
  {
    path: 'detail-participant-data',
    component: DetailParticipantDataComponent
  },
  {
    path: 'add-capability-data',
    component: AddCapabilityDataComponent
  }
];
