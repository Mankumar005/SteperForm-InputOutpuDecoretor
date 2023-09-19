import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletLedgerRoutingModule } from './wallet-ledger-routing.module';
import { WalletLedgerComponent } from './wallet-ledger.component';
import { SharedModule } from '../../../shared/sharde.module';
import { WalletTransactionComponent } from './wallet-transaction/wallet-transaction.component';


@NgModule({
  declarations: [
    WalletLedgerComponent,
    WalletTransactionComponent
  ],
  imports: [
    CommonModule,
    WalletLedgerRoutingModule,
    SharedModule
  ]
})
export class WalletLedgerModule { }
