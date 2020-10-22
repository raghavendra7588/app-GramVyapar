import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderNoComponent } from './dialog-order-no.component';

describe('DialogOrderNoComponent', () => {
  let component: DialogOrderNoComponent;
  let fixture: ComponentFixture<DialogOrderNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrderNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
