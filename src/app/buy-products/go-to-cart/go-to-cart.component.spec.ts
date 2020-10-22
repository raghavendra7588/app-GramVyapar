import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToCartComponent } from './go-to-cart.component';

describe('GoToCartComponent', () => {
  let component: GoToCartComponent;
  let fixture: ComponentFixture<GoToCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoToCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
