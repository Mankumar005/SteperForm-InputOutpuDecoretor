import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
 
import { ContactUsListComponent } from './contact-us-list/contact-us-list.component';
import { ContactUsDetailsComponent } from './contact-us-details/contact-us-details.component';
import { SharedModule } from '../../../shared/sharde.module';
import { ContactComponent } from './contact-us.component';
import { ContectUsRenderComponent } from './render-component/contact-us-edit-view-button';
 


@NgModule({
  declarations: [
    ContactComponent,
    ContactUsListComponent,
    ContactUsDetailsComponent,
    ContectUsRenderComponent
  ],
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    SharedModule
  ]
})
export class ContactUsModule { }
