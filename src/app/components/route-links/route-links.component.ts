import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-route-links',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [
    `
      :host {
        display: flex;
        gap: 0.5rem;
      }

      .active {
        color: red;
      }
    `,
  ],
  template: `
    @for (route of routes; track route.path) {
      <a
        [routerLink]="route.path"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        {{ route.path || 'Home' }}
      </a>
    }
  `,
})
export class RouteLinksComponent {
  routes = routes;
}
