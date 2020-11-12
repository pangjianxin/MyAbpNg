import { ABP, ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import {
  CreateTenant,
  DeleteTenant,
  GetTenantById,
  GetTenants,
  UpdateTenant,
} from '../../actions/tenant-management.actions';
import { GetTenantsInput, TenantDto } from '../../proxy/models';
import { TenantManagementState } from '../../states/tenant-management.state';
import { getPasswordValidators } from 'src/app/pages/theme-shared/uitls/validation.utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TenantService } from '../../proxy';
import { CreateTenantComponent } from '../create-tenant/create-tenant.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EditTenantComponent } from '../edit-tenant/edit-tenant.component';
import { ManageTenantConnectionStringComponent } from '../manage-tenant-connection-string/manage-tenant-connection-string.component';

interface SelectedModalContent {
  type: 'saveConnStr' | 'saveTenant';
  title: string;
  template: TemplateRef<any>;
}

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  providers: [ListService],
})
export class TenantsComponent implements OnInit {

  pageIndex = 0;

  pageSize = 10;

  searchMenuVisible: boolean;

  searchValue = '';

  loading: boolean;

  selected: TenantDto;

  @Select(TenantManagementState.get) data$: Observable<PagedResultDto<TenantDto>>;

  @Select(TenantManagementState.getTenantsTotalCount) totalCount$: Observable<number>;


  constructor(
    public readonly list: ListService<GetTenantsInput>,
    private modal: NzModalService,
    private tenantService: TenantService,
    private fb: FormBuilder,
    private store: Store,
    private local: LocalizationService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.hookToQuery();
  }
  // 表格查询
  hookToQuery(): void {
    this.list.hookToQuery(query => this.store.dispatch(new GetTenants(query))).subscribe();
  }
  // 新增租户
  addTenant(): void {
    this.modal.create({
      nzTitle: this.local.instant('AbpTenantManagement::NewTenant'),
      nzContent: CreateTenantComponent,
      nzFooter: [],
      nzComponentParams: {
        list: this.list
      },
      nzWidth: '60%'
    });
  }
  // 编辑租户
  editTenant(id: string): void {
    this.store
      .dispatch(new GetTenantById(id))
      .pipe(pluck('TenantManagementState', 'selectedItem'))
      .subscribe(selected => {
        this.selected = selected;
        this.modal.create({
          nzTitle: this.local.instant('AbpTenantManagement::Edit'),
          nzContent: EditTenantComponent,
          nzComponentParams: {
            selectedTenant: this.selected,
            list: this.list
          },
          nzWidth: '60%',
          nzFooter: []
        });
      });
  }
  // 删除租户
  deleteTenant(id: string, name: string): void {
    this.modal.confirm({
      nzTitle: this.local.instant('AbpTenantManagement::AreYouSure'),
      nzContent: this.local.instant('AbpTenantManagement::TenantDeletionConfirmationMessage', name),
      nzOnOk: () => this.store.dispatch(new DeleteTenant(id)).subscribe(() => this.list.get()),
      nzOnCancel: () => this.message.info(this.local.instant('AbpTenantManagement::Cancel')),
      nzOkText: this.local.instant('AbpTenantManagement::Submit'),
      nzCancelText: this.local.instant('AbpTenantManagement::Close')
    });
  }
  // 管理租户连接字符串
  editConnectionString(id: string): void {
    this.store
      .dispatch(new GetTenantById(id))
      .pipe(
        pluck('TenantManagementState', 'selectedItem'),
        switchMap(selected => {
          this.selected = selected;
          return this.tenantService.getDefaultConnectionString(id);
        }),
      )
      .subscribe(fetchedConnectionString => {
        this.modal.create({
          nzTitle: this.local.instant('AbpTenantManagement::ConnectionStrings'),
          nzContent: ManageTenantConnectionStringComponent,
          nzComponentParams: {
            selectedTenant: this.selected,
            fetchedConnectionString
          },
          nzFooter: [],
          nzWidth: '50%'
        });
      });
  }

  // 刷新数据
  refresh(): void {
    this.list.get();
  }
  // 表格查询条件变更回调
  onQueryParamsChange($event: NzTableQueryParams): void {
    const sort = $event.sort.filter(it => !!it.value)[0];
    if (sort) {
      switch (sort.value) {
        case 'ascend':
          sort.value = 'asc';
          break;
        default:
          sort.value = 'desc';
          break;
      }
    }
    this.list.page = $event.pageIndex;
    this.list.maxResultCount = $event.pageSize === 0 ? 10 : $event.pageSize;
    this.list.sortKey = sort?.key;
    this.list.sortOrder = sort?.value;
    this.list.filter = $event.filter[0]?.value;
  }
  search(): void { }
}
