import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqListComponent } from './faq-list/faq-list.component';
import { AddEditFaqComponent } from './add-edit-faq/add-edit-faq.component';
import { FaqComponent } from './faq.component';

const routes: Routes = [
    {
      path: '',
      component: FaqComponent,
      children: [
        {
          path: 'faq-list',
          component: FaqListComponent
        }, {
          path: 'add-edit-faq',
          component: AddEditFaqComponent
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
