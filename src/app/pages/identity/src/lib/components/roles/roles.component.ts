import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GetIdentityUsersInput, IdentityRoleDto, IdentityRoleService } from '../../proxy/identity';
import { IdentityState } from '../../states/identity.state';
import { Select, Store } from '@ngxs/store';
import { ListService, LocalizationService, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateRole, DeleteRole, GetRoleById, GetRoles, UpdateRole } from '../../actions/identity.actions';
import { finalize, pluck, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ePermissionManagementComponents } from 'src/app/pages/permission-management/src/lib/enums/components';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CreateRoleComponent } from '../create-role/create-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { PermissionManagementComponent } from 'src/app/pages/permission-management/src/lib/components';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  providers: [ListService]
})
export class RolesComponent implements OnInit {

  @Select(IdentityState.getRoles) data$: Observable<IdentityRoleDto[]>;

  @Select(IdentityState.getRolesTotalCount) totalCount$: Observable<number>;
  // 表格页码
  pageIndex = 0;
  // 表格每页返回的数据行数
  pageSize = 10;
  // 搜索框的可见性
  searchMenuVisible: boolean;
  // 搜索框的的内容
  searchValue = '';
  // 表格是否加载flag
  loading: boolean;
  // 当前选中的role，因为aggregateroot有concurrentstamp，所以每次操作的role需要从数据库查找最新的数据
  selected: IdentityRoleDto;
  // 是否正在处理表单
  modalBusy = false;

  permissionManagementKey = ePermissionManagementComponents.PermissionManagement;

  constructor(
    public readonly list: ListService<PagedAndSortedResultRequestDto>,
    private message: NzMessageService,
    private fb: FormBuilder,
    private store: Store,
    private modal: NzModalService,
    private local: LocalizationService
  ) { }

  ngOnInit(): void {
    this.hookToQuery();
  }

  // 删除role
  deleteRole(id: string, name: string): void {
    const modalRef = this.modal.confirm(
      {
        nzTitle: this.local.instant('AbpIdentity::AreYouSure'),
        nzContent: this.local.instant('AbpIdentity::RoleDeletionConfirmationMessage', name),
        nzOnOk: () => this.store.dispatch(new DeleteRole(id)).subscribe(() => this.list.get()),
        nzOnCancel: () => this.message.info(this.local.instant('AbpIdentity::Cancel')),
        nzCancelText: this.local.instant('AbpIdentity::Close'),
        nzOkText: this.local.instant('AbpIdentity::Submit')
      },
      'confirm');
  }

  private hookToQuery(): void {
    this.loading = true;
    this.list.hookToQuery(query => this.store.dispatch(new GetRoles(query))).subscribe(v => this.loading = false);
  }

  // 打开role权限的对话框
  openRolePermissionDialog(key: string): void {
    this.modal.create({
      nzTitle: '',
      nzContent: PermissionManagementComponent,
      nzComponentParams: {
        providerKey: key,
        providerName: 'R'
      },
      nzFooter: [],
      nzWidth: '60%'
    });
  }
  // ng zorro表格参数变化时的回调
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
  // 查找
  search(): void {
    this.message.warning('not implements');
  }
  // 打开创建role对话框
  openCreateRoleDialog(): void {
    this.modal.create({
      nzTitle: '',
      nzContent: CreateRoleComponent,
      nzComponentParams: {
        list: this.list
      },
      nzFooter: [],
      nzWidth: '60%'
    });
  }
  // 刷新表单
  refresh(): void {
    this.list.get();
  }
  // 打开修改role对话框
  openModRoleInfoDialog(id: string): void {
    this.store.dispatch(new GetRoleById(id)).pipe(
      pluck('IdentityState', 'selectedRole'))
      .subscribe((selectedRole: IdentityRoleDto) => {
        this.selected = selectedRole;
        this.modal.create({
          nzTitle: '',
          nzContent: EditRoleComponent,
          nzFooter: [],
          nzComponentParams: {
            list: this.list,
            selectedRole: this.selected
          }
        });
      });

  }
}
