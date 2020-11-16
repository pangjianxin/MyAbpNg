import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityRoleDto, IdentityUserDto, OrganizationUnitDto } from '../../proxy/identity/models';
import { IdentityState } from '../../states/identity.state';
import { Select, Store } from '@ngxs/store';
import { ListService, LocalizationService, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { pluck, switchMap, take, tap } from 'rxjs/operators';
import { DeleteOrganizationUnit, GetOrganizationUnitById, GetOrganizationUnits } from '../../actions/identity.actions';
import { Identity } from '../../models/identity';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CreateOrganizationUnitComponent } from '../create-organization-unit/create-organization-unit.component';

@Component({
  selector: 'app-organization-units',
  templateUrl: './organization-units.component.html',
  providers: [ListService]
})
export class OrganizationUnitsComponent implements OnInit {


  @Select(IdentityState.getOrgnaizationUnits) data$: Observable<OrganizationUnitDto[]>;

  @Select(IdentityState.getOrganizationUnitsTotalCount) totalCount$: Observable<number>;

  selectedOrganizationUnit: OrganizationUnitDto;

  selectedUserRoles: IdentityRoleDto[];

  searchMenuVisible: boolean;

  searchValue = '';

  pageIndex: number;

  pageSize: number;

  loading: boolean;

  constructor(
    public readonly list: ListService<PagedAndSortedResultRequestDto>,
    private store: Store,
    private message: NzMessageService,
    private modal: NzModalService,
    private local: LocalizationService
  ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.pageIndex = 0;
    this.pageSize = 10;
    this.hookToQuery();
  }

  private hookToQuery(): void {
    this.list.hookToQuery(query => this.store.dispatch(new GetOrganizationUnits(query)))
      .pipe(tap(_ => this.loading = false))
      .subscribe();
  }

  search(): void { }

  // deleteUser(item: IdentityUserDto): void {
  //   this.modal.confirm({
  //     nzTitle: this.local.instant('AbpIdentity::AreYouSure'),
  //     nzContent: this.local.instant('AbpIdentity::UserDeletionConfirmationMessage', item.userName),
  //     nzOnOk: () => this.store.dispatch(new DeleteOrganizationUnit(item.id)).subscribe(() => this.list.get()),
  //     nzOnCancel: () => this.message.info(this.local.instant('AbpIdentity::Cancel')),
  //     nzCancelText: this.local.instant('AbpIdentity::Close'),
  //     nzOkText: this.local.instant('AbpIdentity::Submit')
  //   });
  // }

  // openModiUserInfoDialog(id: string): void {
  //   this.store.dispatch(new GetOrganizationUnitById(id))
  //     .pipe(switchMap(() => this.store.dispatch(new GetUserRoles(id))),
  //       pluck('IdentityState'), // 可以过滤属性{ConfigState:{},IdentityState:{}......}
  //       take(1))
  //     .subscribe((state: Identity.State) => {
  //       this.selectedOrganizationUnit = state.selectedUser;
  //       this.selectedUserRoles = state.selectedUserRoles || [];
  //       this.modal.create({
  //         nzTitle: '编辑用户信息',
  //         nzContent: EditUserComponent,
  //         nzFooter: [],
  //         nzComponentParams: {
  //           selectedUser: this.selectedOrganizationUnit,
  //           selectedUserRoles: this.selectedUserRoles || [],
  //           list: this.list
  //         },
  //         nzWidth: '60%'
  //       });
  //     });
  // }

  // cancel(): void {
  //   this.message.info('你已取消操作');
  // }

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
  refresh(): void {
    this.list.get();
  }
  openModOUDialog() { }
  openCreateOUDialog(): void {
    this.modal.create({
      nzTitle: this.local.instant('::NewOU'),
      nzContent: CreateOrganizationUnitComponent,
      nzComponentParams: {
        list: this.list
      },
      nzFooter: [],
      nzWidth: '60%'
    });
  }
  openOUPermissionDialog() { }
  deleteOU() {

  }
  // openUserPermissionDialog(key: string): void {
  //   this.modal.create({
  //     nzTitle: '',
  //     nzFooter: [],
  //     nzContent: PermissionManagementComponent,
  //     nzComponentParams: {
  //       providerName: 'U',
  //       providerKey: key
  //     },
  //     nzWidth: '60%'
  //   });
  // }
}
