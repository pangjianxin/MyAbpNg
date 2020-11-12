import { ABP, PagedResultDto } from '@abp/ng.core';
import { TenantDto } from '../proxy/models';

// tslint:disable-next-line: no-namespace
export namespace TenantManagement {
  export interface State {
    result: PagedResultDto<TenantDto>;
    selectedItem: TenantDto;
  }
}
