import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Home } from './home/home';
import { Footer } from './components/footer/footer';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header />
    <router-outlet></router-outlet>
    <app-footer />
  `,
  styles: [],
})
export class App {
  protected title = 'manager-zadan';
}

bootstrapApplication(App, {
  providers: [
    /* provideNoopAnimations()*/ /*provideToastr(), provideAnimations()*/ provideAnimations(),
  ],
});
