import { ChangeDetectionStrategy, Component } from '@angular/core'
import { JsonPipe, NgStyle } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-test',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, ReactiveFormsModule, JsonPipe],
  styles: [``],
  template: ``,
})
export class TestComponent { }
