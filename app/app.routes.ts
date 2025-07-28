// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { Form } from './form/form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/manager-zadan',
    pathMatch: 'full',
  },
  {
    path: 'form',
    component: Form,
  },
  {
    path: 'learn',
    loadComponent: () => {
      return import('./learn/learn').then((m) => m.Learn);
    },
  },
  {
    path: 'manager-zadan',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
];
