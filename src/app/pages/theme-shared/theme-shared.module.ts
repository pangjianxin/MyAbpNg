import {
  APP_INITIALIZER,
  Injector,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ErrorHandler } from './handlers/error-handler';
import { CoreModule, noop } from '@abp/ng.core';
import { RootParams } from './models/common';
import { THEME_SHARED_ROUTE_PROVIDERS } from './providers/route.provider';
import {
  httpErrorConfigFactory,
  HTTP_ERROR_CONFIG,
} from './tokens/http-error.token';
import { NgxValidateCoreModule } from '@ngx-validate/core';
@NgModule({
  declarations: [],
  imports: [CommonModule, NzModalModule, CoreModule],
  exports: [
    CommonModule,
    FormsModule,
    NgxValidateCoreModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzPageHeaderModule,
    NzAvatarModule,
    NzMessageModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    NzModalModule,
    NzDescriptionsModule,
    NzTableModule,
    NzDividerModule,
    NzSelectModule,
    NzTagModule,
    NzSpaceModule,
    NzPopconfirmModule,
    NzAutocompleteModule,
    NzDatePickerModule,
    NzToolTipModule,
    NzBadgeModule,
    NzTabsModule,
    NzResultModule,
    NzInputNumberModule,
    NzUploadModule,
    NzCardModule,
    NzStatisticModule,
    NzEmptyModule,
    NzPopoverModule,
    NzStepsModule,
    NzListModule,
    NzRadioModule,
  ],
})
export class ThemeSharedModule {
  constructor(private errorHandler: ErrorHandler) { }

  static forRoot(
    options = {} as RootParams
  ): ModuleWithProviders<ThemeSharedModule> {
    return {
      ngModule: ThemeSharedModule,
      providers: [
        THEME_SHARED_ROUTE_PROVIDERS,
        { provide: HTTP_ERROR_CONFIG, useValue: options.httpErrorConfig },
        {
          provide: 'HTTP_ERROR_CONFIG',
          useFactory: httpErrorConfigFactory,
          deps: [HTTP_ERROR_CONFIG],
        },
      ],
    };
  }
}
