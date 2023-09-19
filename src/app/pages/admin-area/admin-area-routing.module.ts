import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAreaComponent } from './admin-area.component';
 
const routes: Routes = [
  {
    path: '',
    component:AdminAreaComponent,
    children: [
      {
        path: 'accounts',
        loadChildren: () => import('./accounts/accounts.module').then( m => m.AccountsModule),
      },
      {
        path: 'master',
        loadChildren: () => import('./master/master.module').then( m => m.MasterModule),
      },
      {
        path: 'menu',
        loadChildren: () => import('./menus/menus.module').then(m =>m.MenusModule),
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then( m => m.ReportModule),
      },
      {
        path: 'contact-us',
        loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsModule),
      },
      {
        path: 'template',
        loadChildren: () => import('./template/template.module').then( m => m.TemplateModule),
      },
      {
        path: 'faq',
        loadChildren: () => import('./faq/faq-routing.module').then( m => m.FaqRoutingModule),
      },
      {
        path: 'user-roles',
        loadChildren: () => import('./user-roles-permission/user-roles.module').then( m => m.UserRolesModule),
      },
      {
        path: 'shipment-status',
        loadChildren: () => import('./shipment-status/shipment-status.module').then(m => m.ShipmentStatusModule)
      },
      {
        path: 'wallet-ladger',
        loadChildren: () => import('./wallet-ledger/wallet-ledger.module').then( m => m.WalletLedgerModule),
      },
      {
        path: '',
        redirectTo: 'pages/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'pages/dashboard',
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAreaRoutingModule { }
