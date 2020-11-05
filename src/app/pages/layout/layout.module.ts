import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { LayoutMainComponent } from './layout-main/layout-main.component';
import { ThemeSharedModule } from '../theme-shared/theme-shared.module';
import { LayoutComponent } from './layout/layout.component';
import { CurrentUserComponent } from './header/current-user/current-user.component';
import { LanguagesComponent } from './header/languages/languages.component';
import { CoreModule } from '@abp/ng.core';


@NgModule({
  declarations: [HeaderComponent, LayoutMainComponent, LayoutComponent,
    CurrentUserComponent, LanguagesComponent],
  imports: [
    CoreModule,
    LayoutRoutingModule,
    ThemeSharedModule,
  ]
})
export class LayoutModule { }
