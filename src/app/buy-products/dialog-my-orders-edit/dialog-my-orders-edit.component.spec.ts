import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMyOrdersEditComponent } from './dialog-my-orders-edit.component';

describe('DialogMyOrdersEditComponent', () => {
  let component: DialogMyOrdersEditComponent;
  let fixture: ComponentFixture<DialogMyOrdersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMyOrdersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMyOrdersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
