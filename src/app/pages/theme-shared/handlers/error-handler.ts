import { AuthService, Config, RestOccurError } from '@abp/ng.core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentRef,
  Inject,
  Injectable,
} from '@angular/core';
import { Navigate, RouterDataResolved, RouterError, RouterState } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { filter, map } from 'rxjs/operators';
import snq from 'snq';
import { ErrorScreenErrorCodes, HttpErrorConfig } from '../models/common';

export const DEFAULT_ERROR_MESSAGES = {
  defaultError: {
    title: 'An error has occurred!',
    details: 'Error detail not sent by server.',
  },
  defaultError401: {
    title: 'You are not authenticated!',
    details: 'You should be authenticated (sign in) in order to perform this operation.',
  },
  defaultError403: {
    title: 'You are not authorized!',
    details: 'You are not allowed to perform this operation.',
  },
  defaultError404: {
    title: 'Resource not found!',
    details: 'The resource requested could not found on the server.',
  },
  defaultError500: {
    title: 'Internal server error',
    details: 'Error detail not sent by server.',
  },
};

export const DEFAULT_ERROR_LOCALIZATIONS = {
  defaultError: {
    title: 'AbpUi::DefaultErrorMessage',
    details: 'AbpUi::DefaultErrorMessageDetail',
  },
  defaultError401: {
    title: 'AbpUi::DefaultErrorMessage401',
    details: 'AbpUi::DefaultErrorMessage401Detail',
  },
  defaultError403: {
    title: 'AbpUi::DefaultErrorMessage403',
    details: 'AbpUi::DefaultErrorMessage403Detail',
  },
  defaultError404: {
    title: 'AbpUi::DefaultErrorMessage404',
    details: 'AbpUi::DefaultErrorMessage404Detail',
  },
  defaultError500: {
    title: 'AbpUi::500Message',
    details: 'AbpUi::DefaultErrorMessage',
  },
};

@Injectable({ providedIn: 'root' })
export class ErrorHandler {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private dialog: NzModalService,
    @Inject('HTTP_ERROR_CONFIG') private httpErrorConfig: HttpErrorConfig,
  ) {
    this.listenToRestError();
    this.listenToRouterError();
    // this.listenToRouterDataResolved();
  }

  private listenToRouterError(): void {
    this.actions
      .pipe(
        ofActionSuccessful(RouterError),
        filter(this.filterRouteErrors),
      )
      .subscribe(() => this.showError('找不到该路径', '404'));
  }

  // private listenToRouterDataResolved(): void {
  //   this.actions
  //     .pipe(
  //       ofActionSuccessful(RouterDataResolved),
  //       filter(() => !!this.componentRef),
  //     )
  //     .subscribe(() => {
  //       this.componentRef.destroy();
  //       this.componentRef = null;
  //     });
  // }

  private listenToRestError(): void {
    this.actions
      .pipe(
        ofActionSuccessful(RestOccurError),
        map(action => action.payload),
        filter(this.filterRestErrors),
      )
      .subscribe(err => {

        const body = snq(() => err.error.error, {
          key: DEFAULT_ERROR_LOCALIZATIONS.defaultError.title,
          defaultValue: DEFAULT_ERROR_MESSAGES.defaultError.title,
        });

        if (err instanceof HttpErrorResponse && err.headers.get('_AbpErrorFormat')) {
          const confirmation$ = this.showError(null, null, body);

          if (err.status === 401) {
            confirmation$.afterClose.subscribe(() => {
              this.navigateToLogin();
            });
          }
        } else {
          switch (err.status) {
            case 401:
              const modalRef = this.showError(
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError401.title,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError401.title,
                },
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError401.details,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError401.details,
                },
              );
              modalRef.afterClose.subscribe(() => this.navigateToLogin());
              break;
            case 403:
              this.showError(
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError403.title,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError403.title,
                },
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError403.details,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError403.details,
                }
              );
              break;
            case 404:
              this.showError(
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError404.details,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError404.details,
                },
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError404.title,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError404.title,
                },
              );
              break;
            case 500:
              this.showError(
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError500.title,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError500.title,
                },
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError500.details,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError500.details,
                }
              );
              break;
            case 0:
              if (err.statusText === 'Unknown Error') {
                this.showError(
                  {
                    key: DEFAULT_ERROR_LOCALIZATIONS.defaultError.title,
                    defaultValue: DEFAULT_ERROR_MESSAGES.defaultError.title,
                  },
                  err.message,
                );
              }
              break;
            default:
              this.showError(
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError.details,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError.details,
                },
                {
                  key: DEFAULT_ERROR_LOCALIZATIONS.defaultError.title,
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError.title,
                },
              );
              break;
          }
        }
      });
  }

  private showError(
    message?: Config.LocalizationParam,
    title?: Config.LocalizationParam,
    body?: any): NzModalRef<unknown, any> {
    if (body) {
      if (body.details) {
        message = body.details;
        title = body.message;
      } else if (body.message) {
        title = {
          key: DEFAULT_ERROR_LOCALIZATIONS.defaultError.title,
          defaultValue: DEFAULT_ERROR_MESSAGES.defaultError.title,
        };
        message = body.message;
      } else {
        message = body.message || {
          key: DEFAULT_ERROR_LOCALIZATIONS.defaultError.title,
          defaultValue: DEFAULT_ERROR_MESSAGES.defaultError.title,
        };
      }
    }

    return this.dialog.create({
      nzTitle: title as string,
      nzContent: message as string
    });
  }

  private navigateToLogin(): void {
    this.authService.initLogin();
  }

  canCreateCustomError(status: ErrorScreenErrorCodes): boolean {
    return snq(
      () =>
        this.httpErrorConfig.errorScreen.component &&
        this.httpErrorConfig.errorScreen.forWhichErrors.indexOf(status) > -1,
    );
  }

  private filterRestErrors = ({ status }: HttpErrorResponse): boolean => {
    if (typeof status !== 'number') {
      return false;
    }
    return this.httpErrorConfig.skipHandledErrorCodes.findIndex(code => code === status) < 0;
  }

  private filterRouteErrors = (instance: RouterError<any>): boolean => {
    return (
      snq(() => instance.event.error.indexOf('Cannot match') > -1) &&
      this.httpErrorConfig.skipHandledErrorCodes.findIndex(code => code === 404) < 0
    );
  }
}
