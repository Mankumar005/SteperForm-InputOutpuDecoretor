import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGaurdServices } from '../shared/auth-services/auth-gaurd-services';

const routes: Routes = [{
  path: '',
  component: PagesComponent,canActivate: [AuthGaurdServices],
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule)
    },
    {
      path: 'shipments',
      loadChildren: () => import('./shipments/shipments.module').then( m => m.ShipmentsModule)
    },
    {
      path: 'admin-area',
      loadChildren: () => import('./admin-area/admin-area.module').then( m => m.AdminAreaModule),
      canLoad:[AuthGaurdServices]
    },
    {
      path: 'help-desk',
      loadChildren: () => import('./help-desk/help-desk.module').then( m => m.HelpDeskModule)
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module').then( m => m.ProfileModule)
    },
    {
      path: 'user-report',
      loadChildren: () => import('./customer-report/customer-report.module').then( m => m.CustomerReportModule)
    },
    {
      path: 'change-password',
      loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordModule)
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
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
