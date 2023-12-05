import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/angular/angular.component').then(
        (m) => m.AngularComponent,
      ),
  },
  {
    path: 'infinnity',
    loadComponent: () =>
      import('./pages/infinity-scroll/infinity-scroll.component').then(
        (m) => m.InfinityScrollComponent,
      ),
  },
  {
    path: 'view-container-example',
    loadComponent: () =>
      import(
        './pages/view-container-example/view-container-example.component'
      ).then((m) => m.ViewContainerExampleComponent),
  },
  {
    path: 'rxjs',
    loadComponent: () =>
      import('./pages/rxjs/rxjs.component').then((m) => m.RxjsComponent),
  },
  {
    path: 'test',
    loadComponent: () =>
      import('./pages/test/test.component').then((m) => m.TestComponent),
  },
]
