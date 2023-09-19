import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentStatusComponent } from './shipment-status.component';
import { ShipmentStatusListComponent } from './shipment-status-list/shipment-status-list.component';
import { ShipmentStatusAddEditComponent } from './shipment-status-add-edit/shipment-status-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ShipmentStatusComponent,
    children: [
      {
        path: 'shipment-status',
        component: ShipmentStatusListComponent
      },
      {
        path: 'add-edit-shipment-status',
        component: ShipmentStatusAddEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentStatusRoutingModule { }
