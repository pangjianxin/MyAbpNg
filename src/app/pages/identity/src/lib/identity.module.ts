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
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { OrganizationUnitsComponent } from './components/organization-units/organization-units.component';
import { CreateOrganizationUnitComponent } from './components/create-organization-unit/create-organization-unit.component';


@NgModule({
  declarations: [RolesComponent, UsersComponent, RegisterUserComponent, EditUserComponent, CreateRoleComponent, EditRoleComponent, OrganizationUnitsComponent, CreateOrganizationUnitComponent],
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
