import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAreaRoutingModule } from './admin-area-routing.module';
import { AdminAreaComponent } from './admin-area.component';
import { SharedModule } from '../../shared/sharde.module';
import { AccountsModule } from './accounts/accounts.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { FaqModule } from './faq/faq.module';
import { TemplateModule } from './template/template.module';
import { ShipmentStatusListComponent } from './shipment-status/shipment-status-list/shipment-status-list.component';


@NgModule({
  declarations: [
    AdminAreaComponent,
    ShipmentStatusListComponent
  ],
  imports: [
    CommonModule,
    AdminAreaRoutingModule,
    AccountsModule,
    ContactUsModule,
    FaqModule,
    TemplateModule,
    SharedModule
  ]
})
export class AdminAreaModule { }
