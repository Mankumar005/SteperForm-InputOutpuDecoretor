import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentsComponent } from './shipments.component';
import { ShipmentsHistoryComponent } from './shipments-history/shipments-history.component';
import { BookShipmentsComponent } from './book-shipments/book-shipments.component';
import { ShipmentHistoryDetailsComponent } from './shipment-history-details/shipment-history-details.component';

const routes: Routes = [{
  path: '',
  component: ShipmentsComponent,
  children: [
    {
      path: 'shipments-history',
      component: ShipmentsHistoryComponent,
    },
    {
      path: 'book-shipments',
      component: BookShipmentsComponent
    },
    {
      path: 'shipments-history-details',
      component: ShipmentHistoryDetailsComponent
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipmentsRoutingModule {
}
