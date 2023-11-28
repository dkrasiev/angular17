import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfinityScrollComponent } from './infinity-scroll.component';

describe('InfinityScrollComponent', () => {
  let component: InfinityScrollComponent;
  let fixture: ComponentFixture<InfinityScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfinityScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfinityScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
