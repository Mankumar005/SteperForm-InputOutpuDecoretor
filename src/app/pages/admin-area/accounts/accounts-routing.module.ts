import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { ApprovedAccountComponent } from './approved-account/approved-account.component';
import { PendingAccountComponent } from './pending-account/pending-account.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { EditUpdateAccountComponent } from './edit-update-account/edit-update-account.component';
import { SubAccountListComponent } from './sub-accounts/sub-account-list/sub-account-list.component';
import { AddEditSubAccountComponent } from './sub-accounts/add-edit-sub-account/add-edit-sub-account.component';
import { SubAccountDetailsComponent } from './sub-accounts/sub-account-details/sub-account-details.component';

const routes: Routes = [
  {
   path: '',
   component:AccountsComponent,
   children: [
    {
      path: 'approved-account',
      component:ApprovedAccountComponent
    },
    {
      path: 'pending-account',
      component:PendingAccountComponent
    },
    {
      path: 'account-details',
      component:AccountDetailsComponent
    },
    {
      path: 'edit-update-account',
      component:EditUpdateAccountComponent
    },
    {
      path: 'sub-account-list',
      component:SubAccountListComponent
    },
    {
      path: 'add-edit-sub-account',
      component:AddEditSubAccountComponent
    },
    {
      path: 'sub-account-details',
      component:SubAccountDetailsComponent
    }
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
