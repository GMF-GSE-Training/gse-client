import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Environment Service akan di-inject secara otomatis
// Tidak perlu import environment lama

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
