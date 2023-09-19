import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import { UserRolesComponent } from './user-roles.component';
import { SharedModule } from '../../../shared/sharde.module';
import { UserRolesListComponent } from './user-roles/user-roles-list/user-roles-list.component';
import { AddEditUserRoleComponent } from './user-roles/add-edit-user-role/add-edit-user-role.component';
import { UserRenderComponent } from './user-roles/render-component/user-edit-delete-button';


@NgModule({
  declarations: [
    UserRolesComponent,
    UserRolesListComponent,
    AddEditUserRoleComponent,
    UserRenderComponent
  ],
  imports: [
    CommonModule,
    UserRolesRoutingModule,
    SharedModule
  ]
})
export class UserRolesModule { }
