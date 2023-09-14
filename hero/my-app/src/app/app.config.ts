import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'
import { routes } from './app-routers';
import { HeroService } from './hero.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), HeroService]
};
