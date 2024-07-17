import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';

import { environment } from '../environments/environment';
import ROOT_ROUTES from './app.routes';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(ROOT_ROUTES),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => inject(AuthService).tokenGetter(),
          allowedDomains: [environment.BASE_URL],
        },
      })
    ),
    MessageService,
  ],
};
