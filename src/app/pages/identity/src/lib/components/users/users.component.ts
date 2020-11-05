import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListService } from '@abp/ng.core';
import { TableBaseComponent } from 'src/app/pages/theme-shared/components/table-base/table-base.component';
import {
  DeleteUser,
} from '../../actions/identity.actions';
import { IdentityUserService } from '../../proxy/identity/identity-user.service';
import {
  GetIdentityUsersInput,
  IdentityUserDto,
} from '../../proxy/identity/models';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [ListService],
})
export class UsersComponent extends TableBaseComponent<IdentityUserDto> implements OnInit {
  searchMenuVisible: boolean;
  searchValue = '';
  constructor(
    public readonly list: ListService<GetIdentityUsersInput>,
    private store: Store,
    private identityUserService: IdentityUserService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {
    super(list);
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.list.hookToQuery(query => this.identityUserService.getList(query)).subscribe(value => {
      this.grid = value.items;
      this.total = value.totalCount;
    });
  }
  search(): void { }
  deleteUser(): void {
    if (!this.isOnlyOneSelected) {
      this.message.warning('只能选中一项进行操作');
      return;
    }
    this.store.dispatch(new DeleteUser(this.setOfCheckedId[0])).subscribe(() => this.list.get());
  }

  openModiUserInfoDialog(): void {
    if (!this.isOnlyOneSelected) {
      this.message.warning('只能选中一项进行操作');
      return;
    }
    this.modal.create({
      nzTitle: '编辑用户信息',
      nzContent: EditUserComponent,
      nzComponentParams: {
        selected: this.grid.find(it => this.setOfCheckedId.has(it.id)),
      },
      nzFooter: [],
      nzWidth: '60%'
    });
  }
  openRegisterUserDialog(): void {
    this.message.info(' not implemented');
  }
  cancel(): void {
    this.message.info('你已取消操作');
  }
}
