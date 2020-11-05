import { APP_INITIALIZER } from '@angular/core';
import { eLayoutType, RoutesService } from '@abp/ng.core';
import { eThemeSharedRouteNames } from 'src/app/pages/theme-shared/enums/route-names';
import { eIdentityPolicyNames } from '../enums/policy-names';
import { eIdentityRouteNames } from '../enums/route-names';

export const IDENTITY_ROUTE_PROVIDERS = [
    { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

export function configureRoutes(routes: RoutesService): () => void {
    return () => {
        routes.add([
            {
                path: '/main/identity',
                name: eIdentityRouteNames.IdentityManagement,
                parentName: eThemeSharedRouteNames.Administration,
                requiredPolicy: eIdentityPolicyNames.IdentityManagement,
                iconClass: 'user',
                layout: eLayoutType.application,
                order: 1,
            },
            {
                path: '/main/identity/roles',
                name: eIdentityRouteNames.Roles,
                parentName: eIdentityRouteNames.IdentityManagement,
                requiredPolicy: eIdentityPolicyNames.Roles,
                iconClass: 'setting',
                order: 1,
            },
            {
                path: '/main/identity/users',
                name: eIdentityRouteNames.Users,
                parentName: eIdentityRouteNames.IdentityManagement,
                requiredPolicy: eIdentityPolicyNames.Users,
                iconClass: 'user',
                order: 2,
            },
        ]);
    };
}
