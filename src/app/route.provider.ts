import { APP_INITIALIZER } from '@angular/core';
import { eLayoutType, RoutesService } from '@abp/ng.core';

export const APP_ROUTE_PROVIDER = [
  {
    provide: APP_INITIALIZER,
    useFactory: configureRoutes,
    deps: [RoutesService],
    multi: true,
  },
];

function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '',
        name: '::Menu:Home',
        iconClass: 'home',
        order: 1,
        layout: eLayoutType.application,
      },
    ]);
  };
}
