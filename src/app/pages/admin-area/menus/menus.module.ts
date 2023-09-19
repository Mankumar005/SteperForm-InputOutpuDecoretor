import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/sharde.module';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenusRoutingModule } from './menus-routing.module';
import { MenusComponent } from './menu.component';
import { MenuAddEditComponent } from './menu-add-edit/menu-add-edit.component';


@NgModule({
  imports: [
    MenusRoutingModule,
    SharedModule,
  ]
  ,declarations: [
    MenusComponent,
    MenuListComponent,
    MenuAddEditComponent
  ],
  
})
export class MenusModule { }
