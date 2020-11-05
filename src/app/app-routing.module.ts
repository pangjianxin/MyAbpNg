import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutMainComponent } from './pages/layout/layout-main/layout-main.component';
import { LayoutComponent } from './pages/layout/layout/layout.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', component: LayoutComponent },
  {
    path: 'main', component: LayoutMainComponent, children: [
      {
        path: 'account',
        loadChildren: () => import('./pages/account/src/lib/account.module').then(m => m.AccountModule.forLazy({ redirectUrl: '/' }))
      },
      {
        path: 'identity',
        loadChildren: () => import('./pages/identity/src/lib/identity.module').then(m => m.IdentityModule.forLazy())
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
