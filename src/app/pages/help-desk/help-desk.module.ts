import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpDeskRoutingModule } from './help-desk-routing.module';
import { HelpDeskComponent } from './help-desk.component';
import { SharedModule } from '../../shared/sharde.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FAQComponent } from './faq/faq.component';


@NgModule({
  declarations: [
    HelpDeskComponent,
    ContactUsComponent,
    FAQComponent
  ],
  imports: [
    CommonModule,
    HelpDeskRoutingModule,
    SharedModule
  ]
})
export class HelpDeskModule { }
