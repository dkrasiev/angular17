import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <a routerLink="/"> Home</a>
    <a routerLink="/infinity"> Infinity scroll test </a>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent { }
