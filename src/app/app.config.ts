import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { CAPTCHA_CONFIG } from 'ng-hcaptcha';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: CAPTCHA_CONFIG,
      useValue: {
        siteKey: '', // Kosong, akan di-override via [siteKey] binding di component
      }
    }
  ]
};
