import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  // Matikan semua log di production untuk alasan keamanan & performa
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
