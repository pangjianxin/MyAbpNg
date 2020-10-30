import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';

import { AccountRoutingModule } from './account-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ThemeSharedModule } from '../theme-shared/theme-shared.module';
import { CoreModule, LazyModuleFactory } from '@abp/ng.core';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { Options } from './models/options';
import { AuthenticationFlowGuard } from './guards/authentication-flow.guard';
import { ManageProfileGuard } from './guards/manage-profile.guard';
import { ACCOUNT_OPTIONS } from './tokens/options.token';
import { accountOptionsFactory } from './utils/factory-utils';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';


@NgModule({
  declarations: [ChangePasswordComponent, ManageProfileComponent],
  imports: [
    CoreModule,
    AccountRoutingModule,
    ThemeSharedModule,
    // NgxValidateCoreModule,
  ]
})
export class AccountModule {
  static forChild(options: Options): ModuleWithProviders<AccountModule> {
    return {
      ngModule: AccountModule,
      providers: [
        AuthenticationFlowGuard,
        ManageProfileGuard,
        { provide: ACCOUNT_OPTIONS, useValue: options },
        {
          provide: 'ACCOUNT_OPTIONS',
          useFactory: accountOptionsFactory,
          deps: [ACCOUNT_OPTIONS],
        },
      ],
    };
  }

  static forLazy(options: Options): NgModuleFactory<AccountModule> {
    return new LazyModuleFactory(AccountModule.forChild(options));
  }
}
