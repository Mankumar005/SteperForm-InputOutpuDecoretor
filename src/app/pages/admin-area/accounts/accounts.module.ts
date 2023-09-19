import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { SharedModule } from '../../../shared/sharde.module';
import { ApprovedAccountComponent } from './approved-account/approved-account.component';
import { PendingAccountComponent } from './pending-account/pending-account.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountRenderComponent } from './render-component/account-edit-view-button';
import { EditUpdateAccountComponent } from './edit-update-account/edit-update-account.component';
import { SubAccountListComponent } from './sub-accounts/sub-account-list/sub-account-list.component';
import { AddEditSubAccountComponent } from './sub-accounts/add-edit-sub-account/add-edit-sub-account.component';
import { SubAccountsRenderComponent } from './sub-accounts/render-component/sub-account-edit-view-button';
import { SubAccountDetailsComponent } from './sub-accounts/sub-account-details/sub-account-details.component';
 
@NgModule({
  declarations: [
    AccountsComponent,
    ApprovedAccountComponent,
    PendingAccountComponent,
    AccountDetailsComponent,
    AccountRenderComponent,
    EditUpdateAccountComponent,
    SubAccountListComponent,
    AddEditSubAccountComponent,
    SubAccountsRenderComponent,
    SubAccountDetailsComponent

  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule
  ]
})
export class AccountsModule { }
