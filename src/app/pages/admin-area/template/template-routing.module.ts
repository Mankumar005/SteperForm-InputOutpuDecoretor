import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './template.component';
import { EmailTamplateComponent } from './email-tamplate/email-tamplate.component';
 
const routes: Routes = [
  {
    path: '',
    component:TemplateComponent,
    children: [
      {
        path: 'email-tamplate',
        component:EmailTamplateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
