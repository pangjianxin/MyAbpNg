import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ThemeSharedModule } from '../../../theme-shared/theme-shared.module';
import { IdentityRoutingModule } from './identity-routing.module';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';
import { IdentityState } from './states/identity.state';
import { PermissionManagementModule } from 'src/app/pages/permission-management/src/lib/permission-management.module';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { CoreModule, LazyModuleFactory } from '@abp/ng.core';
import { RegisterComponent } from './components/register/register.component';


@NgModule({
  declarations: [RolesComponent, UsersComponent, EditUserComponent, RegisterComponent],
  exports: [RolesComponent, UsersComponent],
  imports: [
    NgxsModule.forFeature([IdentityState]),
    CoreModule,
    IdentityRoutingModule,
    ThemeSharedModule,
    PermissionManagementModule,
  ]
})
export class IdentityModule {
  static forChild(): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [],
    };
  }

  static forLazy(): NgModuleFactory<IdentityModule> {
    return new LazyModuleFactory(IdentityModule.forChild());
  }
}
