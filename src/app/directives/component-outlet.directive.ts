import { Directive, Input, Type, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[appComponentOutlet]',
  standalone: true,
})
export class ComponentOutletDirective {
  @Input()
  public set appComponentOutlet(component: Type<any>) {
    this.viewContainerRef.clear()
    this.viewContainerRef.createComponent(component)
  }

  constructor(private viewContainerRef: ViewContainerRef) { }
}
