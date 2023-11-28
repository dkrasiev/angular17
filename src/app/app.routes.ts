import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/angular/angular.component').then(
        (m) => m.AngularComponent,
      ),
  },
  {
    path: 'infinity',
    loadComponent: () =>
      import('./pages/infinity-scroll/infinity-scroll.component').then(
        (m) => m.InfinityScrollComponent,
      ),
  },
];
