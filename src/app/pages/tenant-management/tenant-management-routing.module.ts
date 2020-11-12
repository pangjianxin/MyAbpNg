import {
  AuthGuard,
  DynamicLayoutComponent,
  PermissionGuard,
  ReplaceableComponents,
  ReplaceableRouteContainerComponent,
  RouterOutletComponent,
} from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsComponent } from './src/lib/components';
import { eTenantManagementComponents } from './src/lib/enums';

const routes: Routes = [
  { path: '', redirectTo: 'tenants', pathMatch: 'full' },
  {
    path: '',
    component: RouterOutletComponent,
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'tenants',
        component: TenantsComponent,
        data: {
          requiredPolicy: 'AbpTenantManagement.Tenants',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantManagementRoutingModule { }
