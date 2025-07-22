import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Form } from './form/form';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./house/house').then((m) => m.House);
    },
  },
  { path: 'form', component: Form },
  {
    path: 'info',
    //pathMatch: 'info',
    loadComponent: () => {
      return import('./info-page/info-page').then((m) => m.InfoPage);
    },
  },
  {
    path: 'manager-zadan',
    //pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
  // {
  //   path: 'manager-zadan',
  //   //pathMatch: 'info',
  //   loadComponent: () => {
  //     return import('./manager-zadan/manager-zadan').then(
  //       (m) => m.ManagerZadan
  //     );
  //   },
  // },
  //   { path: '', redirectTo: '/form', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
