import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Form } from './form/form';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
  { path: 'form', component: Form },
  //   { path: '', redirectTo: '/form', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
