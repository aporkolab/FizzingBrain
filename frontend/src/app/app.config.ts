import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { jwtInterceptor } from './service/jwt.interceptor';

export const SUPPORTED_LANGUAGES = ['en', 'hu'];
export const DEFAULT_LANGUAGE = 'en';

/** Loads the default translation before the first render; a failed load must not block the boot. */
export function initTranslations(translate: TranslateService): Promise<unknown> {
  translate.addLangs(SUPPORTED_LANGUAGES);
  return firstValueFrom(translate.use(DEFAULT_LANGUAGE)).catch(() => undefined);
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Timer and HTTP callbacks still update plain component fields during this migration.
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(),
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: DEFAULT_LANGUAGE,
    }),
    provideAppInitializer(() => initTranslations(inject(TranslateService))),
  ],
};
