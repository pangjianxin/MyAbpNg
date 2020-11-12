import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { InspectorModule } from '@ngneat/inspector';
import { environment } from '../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { ThemeSharedModule } from './pages/theme-shared/theme-shared.module';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AccountConfigModule } from './pages/account/config/account-config.module';
import { LayoutModule } from './pages/layout/layout.module';
import { IdentityConfigModule } from './pages/identity/config/identity-config.module';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { CoreModule } from '@abp/ng.core';
import { TenantManagementConfigModule } from './pages/tenant-management/config/src/tenant-management-config.module';
registerLocaleData(zh);
const INSPECTION_TOOLS = [
  NgxsLoggerPluginModule.forRoot({ disabled: true }),
  // InspectorModule.forRoot(),
];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    CoreModule.forRoot({
      environment,
      sendNullsAsQueryParam: false,
      skipGetAppConfiguration: false,
    }),
    ThemeSharedModule.forRoot(),
    AccountConfigModule.forRoot(),
    IdentityConfigModule.forRoot(),
    TenantManagementConfigModule.forRoot(),
    LayoutModule,
    NgxsModule.forRoot(),
    ...(environment.production ? [] : INSPECTION_TOOLS),
  ],
  providers: [APP_ROUTE_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule { }
