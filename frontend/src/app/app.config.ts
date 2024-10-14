import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {HTTP_INTERCEPTORS, provideHttpClient} from "@angular/common/http";

import {routes} from "./app-routing.module";
import {AuthInterceptor} from "./architecture/AuthInterceptor.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Wichtig: Es erlaubt die Registrierung mehrerer Interceptors
    }
  ]
};
