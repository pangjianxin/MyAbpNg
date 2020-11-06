import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListService } from '@abp/ng.core';
import {
  DeleteUser, GetUserById, GetUserRoles, GetUsers,
} from '../../actions/identity.actions';
import { IdentityUserService } from '../../proxy/identity/identity-user.service';
import {
  GetIdentityUsersInput,
  IdentityRoleDto,
  IdentityUserDto,
} from '../../proxy/identity/models';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { RegisterComponent } from 'src/app/pages/account/src/lib/components/register/register.component';
import { IdentityState } from '../../states/identity.state';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { pluck, switchMap, take, tap } from 'rxjs/operators';
import { Identity } from '../../models/identity';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [ListService],
})
export class UsersComponent implements OnInit {
  @Select(IdentityState.getUsers) data$: Observable<IdentityUserDto[]>;

  @Select(IdentityState.getUsersTotalCount) totalCount$: Observable<number>;

  selectedUser: IdentityUserDto;
  selectedUserRoles: IdentityRoleDto[];
  searchMenuVisible: boolean;

  searchValue = '';

  pageIndex: number;

  pageSize: number;

  loading: boolean;

  constructor(
    public readonly list: ListService<GetIdentityUsersInput>,
    private store: Store,
    private identityUserService: IdentityUserService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.pageIndex = 0;
    this.pageSize = 10;
    this.hookToQuery();
  }

  private hookToQuery(): void {
    this.list.hookToQuery(query => this.store.dispatch(new GetUsers(query)))
      .pipe(tap(_ => this.loading = false))
      .subscribe();
  }

  search(): void { }

  deleteUser(item: IdentityUserDto): void {
    this.store.dispatch(new DeleteUser(item.id)).subscribe(() => this.list.get());
  }

  openModiUserInfoDialog(id: string): void {
    this.store.dispatch(new GetUserById(id))
      .pipe(switchMap(() => this.store.dispatch(new GetUserRoles(id))),
        tap(value => console.log(value)),
        pluck('IdentityState'), // 可以过滤属性{ConfigState:{},IdentityState:{}......}
        take(1))
      .subscribe((state: Identity.State) => {
        this.selectedUser = state.selectedUser;
        this.selectedUserRoles = state.selectedUserRoles || [];
        this.modal.create({
          nzTitle: '编辑用户信息',
          nzContent: EditUserComponent,
          nzFooter: [],
          nzComponentParams: {
            selectedUser: this.selectedUser,
            selectedUserRoles: this.selectedUserRoles
          },
          nzWidth: '60%'
        });
      });
  }

  openRegisterUserDialog(): void {
    this.modal.create({
      nzTitle: '编辑用户信息',
      nzContent: RegisterComponent,
      nzFooter: [],
      nzWidth: '60%'
    });
  }

  cancel(): void {
    this.message.info('你已取消操作');
  }

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
    // this.list.get();
    console.log(this.store.selectSnapshot((state: Identity.State) => state.selectedUser));
  }
}
