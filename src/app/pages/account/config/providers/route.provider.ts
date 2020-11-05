import { APP_INITIALIZER } from '@angular/core';
import { eLayoutType, RoutesService } from '@abp/ng.core';
import { eAccountRouteNames } from '../enums/route-names';

export const ACCOUNT_ROUTE_PROVIDERS = [
    { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

export function configureRoutes(routes: RoutesService): () => void {
    return () => {
        routes.add([
            {
                path: '/main/account',
                name: eAccountRouteNames.Account,
                invisible: true,
                layout: eLayoutType.application,
                order: 1,
            },
            {
                path: '/main/account/register',
                name: eAccountRouteNames.Register,
                parentName: eAccountRouteNames.Account,
                order: 2,
            },
            {
                path: '/main/account/manage-profile',
                name: eAccountRouteNames.ManageProfile,
                parentName: eAccountRouteNames.Account,
                order: 3,
            },
        ]);
    };
}
