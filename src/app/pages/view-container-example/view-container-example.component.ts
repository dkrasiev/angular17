import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
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
      state('void', style({ opacity: 0, scale: 0 })),
      state('*', style({ opacity: 1, scale: 1 })),

      transition(':enter', [animate('.5s ease-in-out')]),
      transition(':leave', [animate('.5s ease-in-out')]),
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
      <!-- (@animation.done)="log($event)" -->
      <div @animation class="circle" [style.background-color]="color">
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

  private get context() {
    return { ...this.form.value }
  }

  constructor(private fb: FormBuilder) {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateViewContext())
  }

  ngAfterViewInit() {
    if (this.containers.length > 0) {
      queueMicrotask(() => {
        this.currentViewContainer = this.containers.get(0)!
        this.currentViewContainer
          .createEmbeddedView(this.template, this.context)
          .markForCheck()
      })
    }
  }

  next(step: number) {
    this.currentViewContainer.clear()

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

    this.currentViewContainer = nextViewContainer
    this.currentViewContainer.createEmbeddedView(this.template, this.context)
  }

  private updateViewContext() {
    if (this.currentViewContainer) {
      const view = this.currentViewContainer.get(
        0,
      ) as EmbeddedViewRef<TemplateContext>

      Object.assign(view.context, this.context)
    }
  }
}
