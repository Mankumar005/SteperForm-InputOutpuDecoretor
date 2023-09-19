import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRolesComponent } from './user-roles.component';
import { UserRolesListComponent } from './user-roles/user-roles-list/user-roles-list.component';
import { AddEditUserRoleComponent } from './user-roles/add-edit-user-role/add-edit-user-role.component';

const routes: Routes = [
  {
    path: '',
    component:UserRolesComponent,
    children: [
      {
        path: 'user-roles-list',
        component:UserRolesListComponent
      },
      {
        path: 'add-edit-user-roles',
        component:AddEditUserRoleComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRolesRoutingModule { }
