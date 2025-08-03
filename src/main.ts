import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Logger } from './app/shared/utils/logger.util';

// Environment Service akan di-inject secara otomatis
// Tidak perlu import environment lama

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => Logger.error('Application bootstrap failed', err));
