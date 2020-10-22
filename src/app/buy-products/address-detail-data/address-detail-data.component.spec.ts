import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetailDataComponent } from './address-detail-data.component';

describe('AddressDetailDataComponent', () => {
  let component: AddressDetailDataComponent;
  let fixture: ComponentFixture<AddressDetailDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressDetailDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDetailDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
