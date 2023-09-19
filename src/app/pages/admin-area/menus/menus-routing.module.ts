import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenusComponent } from './menu.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuAddEditComponent } from './menu-add-edit/menu-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: MenusComponent,
    children: [
      {
        path: 'menu-list',
        component:MenuListComponent
      },
      {
        path: 'add',
        component: MenuAddEditComponent
      },
      {
        path: 'edit',
        component: MenuAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
