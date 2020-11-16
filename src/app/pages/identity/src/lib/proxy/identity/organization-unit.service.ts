import type { GetOrganizationUnitsInput, OrganizationUnitCreateDto, OrganizationUnitDto, OrganizationUnitUpdateDto } from './models';
import { RestService } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrganizationUnitService {
  apiName = 'Default';

  create = (input: OrganizationUnitCreateDto) =>
    this.restService.request<any, OrganizationUnitDto>({
      method: 'POST',
      url: `/api/app/organizationUnit`,
      body: input,
    },
      { apiName: this.apiName })

  delete = (id: string) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/organizationUnit/${id}`,
    },
      { apiName: this.apiName })

  get = (id: string) =>
    this.restService.request<any, OrganizationUnitDto>({
      method: 'GET',
      url: `/api/app/organizationUnit/${id}`,
    },
      { apiName: this.apiName })

  getList = (input: PagedAndSortedResultRequestDto) =>
    this.restService.request<any, PagedResultDto<OrganizationUnitDto>>({
      method: 'GET',
      url: `/api/app/organizationUnit`,
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
      {
        apiName: this.apiName
      })

  update = (id: string, input: OrganizationUnitUpdateDto) =>
    this.restService.request<any, OrganizationUnitDto>({
      method: 'PUT',
      url: `/api/app/organizationUnit/${id}`,
      body: input,
    },
      { apiName: this.apiName })

  constructor(private restService: RestService) { }
}
