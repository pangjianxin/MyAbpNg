import {
  AuthGuard,
  PermissionGuard,
} from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsComponent } from './src/lib/components';

const routes: Routes = [
  { path: '', redirectTo: 'tenants', pathMatch: 'full' },
  {
    path: 'tenants',
    component: TenantsComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      requiredPolicy: 'AbpTenantManagement.Tenants',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantManagementRoutingModule { }
