import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// NGXS imports
import { provideStore } from '@ngxs/store';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';

import { FlashcardsState } from '../state/flashcard.state'; // Twoja ścieżka
import { environment } from '../environments/enviroment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // Konfiguracja NGXS
    provideStore(
      [FlashcardsState],
      withNgxsReduxDevtoolsPlugin({
        disabled: environment.production,
      })
    ),
  ],
};
