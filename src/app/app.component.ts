import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouteLinksComponent } from './components/route-links/route-links.component'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouteLinksComponent],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;

        height: 100%;
      }

      header {
        height: 4rem;

        padding: 0 1rem;

        margin-bottom: 2rem;

        border-bottom: 1px solid black;
        box-shadow: 0px 0px 2rem 0.5rem lightgray;

        display: flex;
        align-content: center;
      }

      app-route-links {
        align-items: center;
      }

      main {
        flex: 1;

        width: 54rem;
        margin: auto;
      }
    `,
  ],
  template: `
    <header>
      <app-route-links></app-route-links>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent { }
