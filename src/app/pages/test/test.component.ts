import {
  AfterViewInit,
  Component,
  Injector,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  runInInjectionContext,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule, NgClass } from '@angular/common'
import { first, interval, of, switchMap, take, tap } from 'rxjs'

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, NgClass],
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        gap: 0.5rem;
      }

      .urgent {
        background: pink;
        padding: 0 0.5rem;
        border-radius: 0.25rem;
      }

      .item {
        line-height: 2rem;
      }
    `,
  ],
  template: `
    <button (click)="start()">Start</button>

    <div class="container">
      <ng-container #container></ng-container>
    </div>

    <ng-template #template let-index="index" let-value="value">
      <p class="item" [class.urgent]="index % 2 === 0">
        {{ index }}. value: {{ value }}
      </p>
    </ng-template>
  `,
})
export class TestComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef })
  private container!: ViewContainerRef

  @ViewChild(TemplateRef)
  private template!: TemplateRef<any>

  private delay = 500
  private itemsCount = 10

  constructor(private injector: Injector) { }

  start() {
    this.run(() => {
      of(this.container)
        .pipe(
          first(),
          tap(() => {
            for (let i = 0; i < this.itemsCount; i++) {
              this.create(this.container)
            }
          }),
          switchMap((viewContainer) => this.startMoving(viewContainer)),
        )
        .subscribe({
          complete: () => {
            this.run(() => {
              this.clear(this.container).subscribe()
            })
          },
        })
    })
  }

  ngAfterViewInit() {
    this.start()
  }

  private create(viewContainer: ViewContainerRef) {
    const index = viewContainer.length + 1
    const value = Math.random().toString()

    const view = viewContainer.createEmbeddedView(this.template, {
      index,
      value,
    })

    viewContainer.insert(view)
  }

  private startMoving(viewContainer: ViewContainerRef) {
    return interval(this.delay).pipe(
      takeUntilDestroyed(),
      take(viewContainer.length),
      tap(() => {
        for (let i = 0; i < viewContainer.length; i++) {
          const view = viewContainer.get(i)
          const nextIndex = (i + 2) % viewContainer.length

          view && viewContainer.move(view, nextIndex)
        }
      }),
    )
  }

  private clear(viewContainer: ViewContainerRef) {
    return interval(this.delay).pipe(
      takeUntilDestroyed(),
      take(viewContainer.length),
      tap(() => {
        viewContainer.get(0)?.destroy()
      }),
    )
  }

  private run(fn: () => unknown) {
    queueMicrotask(() => {
      runInInjectionContext(this.injector, () => {
        fn()
      })
    })
  }
}
