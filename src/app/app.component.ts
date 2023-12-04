import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouteLinksComponent } from './components/route-links/route-links.component'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouteLinksComponent],
  template: `
    <app-route-links></app-route-links>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent { }
