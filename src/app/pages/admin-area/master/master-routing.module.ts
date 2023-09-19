import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { HsnCodeListComponent } from './hsn-code/hsn-code-list/hsn-code-list.component';
import { AddEditHsnCodeComponent } from './hsn-code/add-edit-hsn-code/add-edit-hsn-code.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { AddEditWarehouseComponent } from './warehouse/add-edit-warehouse/add-edit-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: 'hsn-code-list',
        component:HsnCodeListComponent
      },
      {
        path: 'add-edit-hsn-code',
        component:AddEditHsnCodeComponent
      },
      {
        path: 'warehouse-list',
        component:WarehouseListComponent
      },
      {
        path: 'add-edit-warehouse',
        component:AddEditWarehouseComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
