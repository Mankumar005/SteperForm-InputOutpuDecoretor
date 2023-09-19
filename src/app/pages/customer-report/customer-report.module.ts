import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerReportRoutingModule } from './customer-report-routing.module';
import { CustomerReportComponent } from './customer-report.component';
import { SharedModule } from '../../shared/sharde.module';
import { CustomerWalletComponent } from './customer-wallet/customer-wallet.component';


@NgModule({
  declarations: [
    CustomerReportComponent,
    CustomerWalletComponent
  ],
  imports: [
    CommonModule,
    CustomerReportRoutingModule,
    SharedModule
  ]
})
export class CustomerReportModule { }
