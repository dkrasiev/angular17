import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  PartialObserver,
  combineLatest,
  of,
} from 'rxjs';
import { startWith, delay, concatMap, switchMap, map } from 'rxjs/operators';

enum State {
  Loading = 'loading',
  Fulfilled = 'fulfilled',
}

interface FulfilledModel<T> {
  state: State.Fulfilled;
  data: T;
}

interface LoadingModel {
  state: State.Loading;
}

type Model<T> = FulfilledModel<T> | LoadingModel;

interface Source {
  page: number;
  data: string[];
}

// const log = <T>(prefix: string) =>
//   tap<T>((value) => console.log(prefix, value));

const logObserver = <T>(prefix: string): PartialObserver<T> => ({
  next: (value) => console.log(prefix, value),
});

@Component({
  selector: 'app-infinity-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinity-scroll.component.html',
  styleUrl: './infinity-scroll.component.scss',
})
export class InfinityScrollComponent {
  page$ = new BehaviorSubject(0);
  filter$ = new BehaviorSubject<void>(undefined);

  source$: Observable<Model<Source>>;
  model$: Observable<Model<string[]>>;

  constructor() {
    this.source$ = this.filter$.pipe(
      switchMap(() =>
        this.page$.pipe(
          concatMap((page) => {
            return of({
              state: State.Fulfilled,
              data: {
                page,
                data: [Math.random().toString()],
              },
            }).pipe(
              delay(1000),
              startWith({
                state: State.Loading,
              } as LoadingModel),
            );
          }),
        ),
      ),
    );

    let values: string[] = [];
    this.model$ = combineLatest([this.page$, this.source$]).pipe(
      map(([page, curr]) => {
        if (page === 0 && curr.state === State.Loading) {
          return { state: State.Loading };
        }

        if (curr.state === State.Fulfilled) {
          if (curr.data.page === 0) {
            values = curr.data.data;
          } else {
            values.push(...curr.data.data);
          }
        }

        return {
          state: State.Fulfilled,
          data: values,
        };
      }),
    );

    (
      [
        [this.page$, 'page$'] as const,
        [this.source$, 'source$'] as const,
        [this.model$, 'model$'] as const,
        [this.filter$, 'filter$'] as const,
      ] as Array<[Observable<unknown>, string]>
    ).forEach(([observable, name]) => {
      observable.pipe(takeUntilDestroyed()).subscribe(logObserver(name));
    });
  }

  resetPage() {
    this.page$.next(0);
  }

  nextPage() {
    this.page$.next(this.page$.value + 1);
  }

  changeFilter() {
    this.filter$.next();
    this.resetPage();
  }
}
