import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMyOrdersViewComponent } from './dialog-my-orders-view.component';

describe('DialogMyOrdersViewComponent', () => {
  let component: DialogMyOrdersViewComponent;
  let fixture: ComponentFixture<DialogMyOrdersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMyOrdersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMyOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
