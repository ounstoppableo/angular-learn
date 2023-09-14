import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HousingService } from './app/housing.service';
import { routes } from './app/app-routes'

bootstrapApplication(AppComponent, {
  providers: [
    HousingService,
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
