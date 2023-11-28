import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularComponent } from './angular.component';

describe('AngularComponent', () => {
  let component: AngularComponent;
  let fixture: ComponentFixture<AngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'angular17' title`, () => {
    const fixture = TestBed.createComponent(AngularComponent);
    const component = fixture.componentInstance;
    expect(component.title).toEqual('angular17');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AngularComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, angular17',
    );
  });
});
