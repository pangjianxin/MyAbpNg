import { AuthGuard } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutMainComponent } from './pages/layout/src/lib/components/layout-main/layout-main.component';
import { WelcomeComponent } from './pages/layout/src/lib/components/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/welcome'
      },
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/src/lib/account.module').then(m => m.AccountModule.forLazy({ redirectUrl: '/' }))
      },
      {
        path: 'identity',
        loadChildren: () => import('./pages/identity/src/lib/identity.module').then(m => m.IdentityModule.forLazy())
      },
      {
        path: 'tenant-management',
        loadChildren: () =>
          import('./pages/tenant-management/tenant-management.module').then(m => m.TenantManagementModule.forLazy()),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
