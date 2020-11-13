import { NgModule } from '@angular/core';
import { ThemeSharedModule } from '../../../theme-shared/theme-shared.module';
import { CoreModule } from '@abp/ng.core';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LayoutMainComponent } from './components/layout-main/layout-main.component';
import { HeaderComponent } from './components/header/header.component';
import { LanguagesComponent } from './components/header/languages/languages.component';
import { CurrentUserComponent } from './components/header/current-user/current-user.component';


@NgModule({
  declarations: [HeaderComponent, LayoutMainComponent,
    CurrentUserComponent, LanguagesComponent, WelcomeComponent],
  imports: [
    CoreModule,
    ThemeSharedModule,
  ]
})
export class LayoutModule { }
