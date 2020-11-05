import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { AccountRoutingModule } from './account-routing.module';
import { ThemeSharedModule } from '../../../theme-shared/theme-shared.module';
import { AuthenticationFlowGuard } from './guards/authentication-flow.guard';
import { ManageProfileGuard } from './guards/manage-profile.guard';
import { ACCOUNT_OPTIONS } from './tokens/options.token';
import { accountOptionsFactory } from './utils/factory-utils';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PersonalSettingsComponent } from './components/personal-settings/personal-settings.component';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';
import { Options } from './models/options';
import { RegisterComponent } from './components/register/register.component';
import { CoreModule, LazyModuleFactory } from '@abp/ng.core';



@NgModule({
  declarations: [ChangePasswordComponent,
    ManageProfileComponent,
    PersonalSettingsComponent,
    RegisterComponent],
  imports: [
    AccountRoutingModule,
    CoreModule,
    ThemeSharedModule,
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
