import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpDeskComponent } from './help-desk.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FAQComponent } from './faq/faq.component';

const routes: Routes = [
  {
    path: '',
    component:HelpDeskComponent,
    children: [
      {
        path: 'contact-us',
        component:ContactUsComponent
      },
      {
        path: 'faq',
        component:FAQComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpDeskRoutingModule { }
