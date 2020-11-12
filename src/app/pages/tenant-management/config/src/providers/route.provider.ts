import { eLayoutType, RoutesService } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';
import { eThemeSharedRouteNames } from 'src/app/pages/theme-shared/enums/route-names';
import { eTenantManagementPolicyNames } from '../enums/policy-names';
import { eTenantManagementRouteNames } from '../enums/route-names';

export const TENANT_MANAGEMENT_ROUTE_PROVIDERS = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '/main/tenant-management',
        name: eTenantManagementRouteNames.TenantManagement,
        parentName: eThemeSharedRouteNames.Administration,
        requiredPolicy: eTenantManagementPolicyNames.TenantManagement,
        layout: eLayoutType.application,
        iconClass: 'audit',
        order: 2,
      },
      {
        path: '/main/tenant-management/tenants',
        name: eTenantManagementRouteNames.Tenants,
        parentName: eTenantManagementRouteNames.TenantManagement,
        requiredPolicy: eTenantManagementPolicyNames.Tenants,
        iconClass: 'user-switch',
        order: 1,
      },
    ]);
  };
}
