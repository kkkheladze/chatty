import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { refreshTokenInterceptor } from '@core/interceptors/refresh-token.interceptor';
import { AuthService } from '@core/services/auth.service';
import { SocketIoModule } from 'ngx-socket-io';
import { MessageService } from 'primeng/api';
import { environment } from '../environments/environment';
import ROOT_ROUTES from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(ROOT_ROUTES),
    provideAnimations(),
    provideHttpClient(withInterceptors([refreshTokenInterceptor]), withInterceptorsFromDi()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => inject(AuthService).tokenGetter(),
          allowedDomains: [environment.BASE_URL],
        },
      }),
      SocketIoModule.forRoot({ url: environment.WS_URL })
    ),
    MessageService,
  ],
};
