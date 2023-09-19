import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletLedgerComponent } from './wallet-ledger.component';
import { WalletTransactionComponent } from './wallet-transaction/wallet-transaction.component';

const routes: Routes = [
  {
    path: '',
    component: WalletLedgerComponent,
    children: [
      {
        path: 'wallet-transaction',
        component: WalletTransactionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletLedgerRoutingModule { }
