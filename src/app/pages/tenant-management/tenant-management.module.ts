import { CoreModule, LazyModuleFactory } from '@abp/ng.core';
import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ThemeSharedModule } from '../theme-shared/theme-shared.module';
import { TenantsComponent } from './src/lib/components';
import { TenantManagementState } from './src/lib/states';
import { TenantManagementRoutingModule } from './tenant-management-routing.module';
import { CreateTenantComponent } from './src/lib/components/create-tenant/create-tenant.component';
import { EditTenantComponent } from './src/lib/components/edit-tenant/edit-tenant.component';
import { ManageTenantConnectionStringComponent } from './src/lib/components/manage-tenant-connection-string/manage-tenant-connection-string.component';

@NgModule({
  declarations: [TenantsComponent, CreateTenantComponent, EditTenantComponent, ManageTenantConnectionStringComponent],
  exports: [TenantsComponent],
  imports: [
    TenantManagementRoutingModule,
    NgxsModule.forFeature([TenantManagementState]),
    // NgxValidateCoreModule,
    CoreModule,
    ThemeSharedModule,
    // NgbDropdownModule,
    // FeatureManagementModule,
  ],
})
export class TenantManagementModule {
  static forChild(): ModuleWithProviders<TenantManagementModule> {
    return {
      ngModule: TenantManagementModule,
      providers: [],
    };
  }

  static forLazy(): NgModuleFactory<TenantManagementModule> {
    return new LazyModuleFactory(TenantManagementModule.forChild());
  }
}
