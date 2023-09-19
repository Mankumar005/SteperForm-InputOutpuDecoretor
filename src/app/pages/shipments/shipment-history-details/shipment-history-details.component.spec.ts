import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentHistoryDetailsComponent } from './shipment-history-details.component';

describe('ShipmentHistoryDetailsComponent', () => {
  let component: ShipmentHistoryDetailsComponent;
  let fixture: ComponentFixture<ShipmentHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentHistoryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
