import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { CoreModule } from '@abp/ng.core';
import { environment } from '../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { ThemeSharedModule } from './pages/theme-shared/theme-shared.module';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AccountConfigModule } from './pages/account/config/account-config.module';
registerLocaleData(zh);
const LOGGERS = [NgxsLoggerPluginModule.forRoot({ disabled: true })];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    CoreModule.forRoot({ environment, skipGetAppConfiguration: false }),
    ThemeSharedModule.forRoot(),
    NgxsModule.forRoot(),
    AccountConfigModule.forRoot(),
    ...(environment.production ? [] : LOGGERS),
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, APP_ROUTE_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule { }
