import { APP_INITIALIZER } from '@angular/core';
import { RoutesService } from '@abp/ng.core';
import { eThemeSharedRouteNames } from '../enums/route-names';

export const THEME_SHARED_ROUTE_PROVIDERS = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: undefined,
        name: eThemeSharedRouteNames.Administration,
        iconClass: 'setting',
        invisible: false,
        order: 100,
      },
    ]);
  };
}
