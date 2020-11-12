import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getPasswordValidators } from 'src/app/pages/theme-shared/uitls/validation.utils';
import snq from 'snq';
import { IdentityUserService } from '../../proxy/identity/identity-user.service';
import { IdentityRoleDto, IdentityUserDto } from '../../proxy/identity';
import { Store } from '@ngxs/store';
import { UpdateUser } from '../../actions/identity.actions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  @Input() selectedUser: IdentityUserDto;
  @Input() selectedUserRoles: IdentityRoleDto[];
  form: FormGroup;
  assignableRoles: IdentityRoleDto[];
  modalBusy: boolean;
  constructor(private identityUserService: IdentityUserService,
    private fb: FormBuilder,
    private store: Store, private message: NzMessageService) {
  }
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    this.identityUserService.getAssignableRoles().subscribe(({ items }) => {
      this.assignableRoles = items;
      const passwordValidators = getPasswordValidators(this.store);
      this.form = this.fb.group({
        userName: [this.selectedUser.userName || '', [Validators.maxLength(256)]],
        name: [this.selectedUser.name || '', [Validators.maxLength(64)]],
        surname: [this.selectedUser.surname || '', [Validators.maxLength(64)]],
        email: [this.selectedUser.email || '', [Validators.email, Validators.maxLength(256)]],
        phoneNumber: [this.selectedUser.phoneNumber || '', [Validators.maxLength(16)]],
        lockoutEnabled: [this.selectedUser.lockoutEnabled],
        roleNames: [this.assignableRoles
          .filter(it => this.selectedUserRoles
            .some(i => i.id === it.id) || it.isDefault)
          .map(t => t.name), [Validators.minLength(1)]],
        password: ['', [...passwordValidators]]
      });
    });
  }

  submit(): void {
    console.log(this.form.value);
    if (!this.form.valid) {
      return;
    }
    this.modalBusy = true;
    this.store
      .dispatch(
        new UpdateUser({
          ...this.selectedUser,
          ...this.form.value,
          id: this.selectedUser.id,
        })
      ).pipe(finalize(() => this.modalBusy = false))
      .subscribe(() => {
        this.message.success('修改客户信息成功');
      });
  }
}
