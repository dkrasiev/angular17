import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EmbeddedViewRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewRef,
} from '@angular/core'
import { AsyncPipe, CommonModule, JsonPipe, NgStyle } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Subject } from 'rxjs'

type TemplateContext = Partial<{
  color: string
  text: string
}>

@Component({
  selector: 'app-view-container-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animation', [
      // state('void', style({ opacity: 0, transform: 'translateX(-100%)' })),
      // state('*', style({ opacity: 1, transform: 'translateX(0)' })),

      // state('void', style({ height: 0, width: 0 })),
      // state('*', style({ height: '*', width: '*' })),

      // state('void', style({ scale: 0 })),
      // state('*', style({ scale: 1 })),

      transition(':enter, void => void, * => *, void => *', [
        style({ scale: 0 }),
        animate('.5s ease-in-out', style({ scale: 1 })),
      ]),
      transition(':leave', [
        style({ scale: 1 }),
        animate('.5s ease-in-out', style({ scale: 0 })),
      ]),
    ]),
  ],
  imports: [CommonModule, NgStyle, ReactiveFormsModule, AsyncPipe, JsonPipe],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }

      .column {
        height: 116px;
        padding: 0.5rem;

        counter-increment: container;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        background-color: lightgray;
        border: 1px solid black;

        position: relative;

        &::after {
          position: absolute;
          top: 0;
          left: 0;

          padding: 0.25rem;

          content: 'container #' counter(container);
        }

        &:last-child {
          border-top: none;
        }
      }

      .circle {
        width: 100px;
        height: 100px;

        border: 1px solid black;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;
        text-overflow: fade;
      }

      .row {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      }
    `,
  ],
  template: `
    <form [formGroup]="form">
      <input type="text" formControlName="text" />
      <input type="text" formControlName="color" />

      <!-- <input #step type="number" placeholder="step" [value]="1" /> -->
      <button type="button" (click)="next(-1)">previous</button>
      <button type="button" (click)="next(1)">next</button>
    </form>

    <div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
      <div class="column">
        <ng-container #container></ng-container>
      </div>
    </div>

    <ng-template #template let-color="color" let-text="text">
      <div
        @animation
        (@animation.done)="log($event)"
        class="circle"
        [style.background-color]="color"
      >
        {{ text }}
      </div>
    </ng-template>
  `,
})
export class ViewContainerExampleComponent implements AfterViewInit {
  get random() {
    return Math.random()
  }

  trigger$ = new Subject<number>()

  form = this.fb.group({
    text: this.fb.control('Hello, World!', { nonNullable: true }),
    color: this.fb.control('pink', { nonNullable: true }),
  })

  @ViewChildren('container', { read: ViewContainerRef })
  private containers!: QueryList<ViewContainerRef>

  @ViewChild('template', { read: TemplateRef, static: true })
  private template!: TemplateRef<TemplateContext>

  private currentViewContainer!: ViewContainerRef

  constructor(private fb: FormBuilder) {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.updateViewContext(value))
  }

  ngAfterViewInit() {
    if (this.containers.length > 0) {
      queueMicrotask(() => {
        const { color, text } = this.form.value
        this.currentViewContainer = this.containers.get(0)!
        this.currentViewContainer
          .createEmbeddedView(this.template, { color, text })
          .markForCheck()

        const view = this.currentViewContainer.get(0)
        console.log(view)
      })
    }
  }

  next(step: number) {
    const view = this.currentViewContainer.get(0)
    if (!view) {
      return
    }

    const nextIndex = this.containers.reduce((acc, curr, i) => {
      if (curr === this.currentViewContainer) {
        const result = (i + step) % this.containers.length
        return result < 0 ? this.containers.length - 1 : result
      }

      return acc
    }, 0)

    const nextViewContainer = this.containers.get(nextIndex)
    if (!nextViewContainer) {
      return
    }

    nextViewContainer.insert(view)
    this.currentViewContainer = nextViewContainer
    this.updateViewContext(this.form.value)
    this.trigger$.next(Math.random())

    view.reattach()
  }

  private updateViewContext(value: TemplateContext) {
    const view = this.currentViewContainer.get(0)
    if (this.isEmbeddedView<TemplateContext>(view)) {
      view.context.color = value.color
      view.context.text = value.text
    }
  }

  private isEmbeddedView<T>(value: unknown): value is EmbeddedViewRef<T> {
    return Boolean(
      value &&
      typeof value === 'object' &&
      // @ts-ignore
      (value['context'] as unknown) &&
      // @ts-ignore
      typeof value['context'] === 'object',
    )
  }

  public log(e: unknown) {
    console.log(e)
  }
}
