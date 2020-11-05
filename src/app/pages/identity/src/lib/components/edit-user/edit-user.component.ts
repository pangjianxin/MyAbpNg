import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getPasswordValidators } from 'src/app/pages/theme-shared/uitls/validation.utils';
import snq from 'snq';
import { IdentityUserService } from '../../proxy/identity/identity-user.service';
import { IdentityRoleDto, IdentityUserDto } from '../../proxy/identity';
import { Store } from '@ngxs/store';
import { CreateUser, GetUserById, GetUserRoles, UpdateUser } from '../../actions/identity.actions';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import { Identity } from '../../models/identity';
import { ListService } from '@abp/ng.core';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  providers: []
})
export class EditUserComponent implements OnInit {
  @Input() selected: IdentityUserDto;
  form: FormGroup;
  assignableRoles: IdentityRoleDto[];
  selectedUserRoles: IdentityRoleDto[];
  inProgress: boolean;
  modalBusy: boolean;
  isModalVisible: boolean;
  constructor(private identityUserService: IdentityUserService, private fb: FormBuilder,
    private store: Store, private message: NzMessageService) {
  }
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    this.identityUserService.getAssignableRoles().subscribe(({ items }) => {
      this.assignableRoles = items;
      this.form = this.fb.group({
        userName: [this.selected.userName || '', [Validators.required, Validators.maxLength(256)]],
        email: [this.selected.email || '', [Validators.required, Validators.email, Validators.maxLength(256)]],
        name: [this.selected.name || '', [Validators.maxLength(64)]],
        surname: [this.selected.surname || '', [Validators.maxLength(64)]],
        phoneNumber: [this.selected.phoneNumber || '', [Validators.maxLength(16)]],
        lockoutEnabled: [this.selected.id ? this.selected.lockoutEnabled : true],
        roleNames: [Array.from(''), [Validators.required, Validators.maxLength(1)]]
      });
      const passwordValidators = getPasswordValidators(this.store);
      this.form.addControl('password', new FormControl('', [...passwordValidators]));
      if (!this.selected.userName) {
        this.form.get('password').setValidators([...passwordValidators, Validators.required]);
        this.form.get('password').updateValueAndValidity();
      }
    });
  }

  submit(): void {
    console.log(this.form.value);
    // if (!this.form.valid || this.modalBusy) {
    //   return;
    // }
    // this.modalBusy = true;
    // const { roleNames } = this.form.value;
    // const mappedRoleNames = snq(
    //   () =>
    //     roleNames.filter(role => !!role[Object.keys(role)[0]]).map(role => Object.keys(role)[0]),
    //   [],
    // );
    // this.store
    //   .dispatch(
    //     // this.selected.id
    //     //   ?
    //     //   : new CreateUser({
    //     //     ...this.form.value,
    //     //     roleNames: mappedRoleNames,
    //     //   }),
    //     new UpdateUser({
    //       ...this.selected,
    //       ...this.form.value,
    //       id: this.selected.id,
    //       roleNames: mappedRoleNames,
    //     })
    //   )
    //   .subscribe(() => {
    //     // this.list.get();
    //     this.message.success('修改客户信息成功');
    //   });
  }
}
