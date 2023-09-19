import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentStatusAddEditComponent } from './shipment-status-add-edit.component';

describe('ShipmentStatusAddEditComponent', () => {
  let component: ShipmentStatusAddEditComponent;
  let fixture: ComponentFixture<ShipmentStatusAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentStatusAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentStatusAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
