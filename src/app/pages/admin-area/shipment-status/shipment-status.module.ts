import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/sharde.module';
import { ShipmentStatusComponent } from './shipment-status.component';
import { ShipmentStatusRoutingModule } from './shipment-status-routing.module';
import { ShipmentStatusAddEditComponent } from './shipment-status-add-edit/shipment-status-add-edit.component';


@NgModule({
  declarations: [
    ShipmentStatusComponent,
    ShipmentStatusAddEditComponent,
  ],
  imports: [
    CommonModule,
    ShipmentStatusRoutingModule,
    SharedModule
  ]
})
export class ShipmentStatusModule { }
