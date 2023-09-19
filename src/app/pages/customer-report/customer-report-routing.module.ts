import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerReportComponent } from './customer-report.component';
import { CustomerWalletComponent } from './customer-wallet/customer-wallet.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerReportComponent,
    children: [
      {
        path: 'user-wallet',
        component: CustomerWalletComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReportRoutingModule { }
