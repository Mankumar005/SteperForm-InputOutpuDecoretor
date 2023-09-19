import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
} from '@nebular/auth';
import { AuthGaurdServices } from './shared/auth-services/auth-gaurd-services';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,canActivateChild: [AuthGaurdServices],
    children: [
      {
        path: 'login', loadChildren: () => import('./auth/login/login.module')
       .then(mod => mod.LoginModule)
      },
      {
        path: 'sign-up', loadChildren: () => import('./auth/register/register.module')
          .then(mod => mod.RegisterModule) 
      },
      {
        path: '', loadChildren: () => import('./auth/login/login.module')
       .then(mod => mod.LoginModule)
      }
    ],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
