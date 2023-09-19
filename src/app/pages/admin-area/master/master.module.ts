import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { SharedModule } from '../../../shared/sharde.module';
import { HsnCodeListComponent } from './hsn-code/hsn-code-list/hsn-code-list.component';
import { AddEditHsnCodeComponent } from './hsn-code/add-edit-hsn-code/add-edit-hsn-code.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { AddEditWarehouseComponent } from './warehouse/add-edit-warehouse/add-edit-warehouse.component';
import { HSNCodeRenderComponent } from './hsn-code/render-component/hsn-code-edit-view-button';
import { WareHouseRenderComponent } from './warehouse/render-component/warehouse-edit-view-button';
import { ShipmentStatusRenderComponent } from '../shipment-status/render-component/status-edit-delete-button';


@NgModule({
  declarations: [
    MasterComponent,
    HsnCodeListComponent,
    AddEditHsnCodeComponent,
    WarehouseListComponent,
    AddEditWarehouseComponent,
    HSNCodeRenderComponent,
    WareHouseRenderComponent,
    ShipmentStatusRenderComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule
  ]
})
export class MasterModule { }
