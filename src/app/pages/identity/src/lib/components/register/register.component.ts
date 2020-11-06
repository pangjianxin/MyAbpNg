import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import snq from 'snq';
import { getPasswordValidators } from 'src/app/pages/theme-shared/uitls/validation.utils';
import { CreateUser } from '../../actions/identity.actions';
import { IdentityRoleDto, IdentityUserService } from '../../proxy/identity';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
        userName: ['', [Validators.maxLength(256)]],
        email: ['', [Validators.email, Validators.maxLength(256)]],
        name: ['', [Validators.maxLength(64)]],
        surname: ['', [Validators.maxLength(64)]],
        phoneNumber: ['', [Validators.maxLength(16)]],
        lockoutEnabled: [false],
        roleNames: [Array.from(''), [Validators.maxLength(1)]]
      });
      const passwordValidators = getPasswordValidators(this.store);
      this.form.addControl('password', new FormControl('', [...passwordValidators, Validators.required]));
    });
  }

  submit(): void {
    console.log(this.form.value);
    if (!this.form.valid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    const { roleNames } = this.form.value;
    const mappedRoleNames = snq(
      () =>
        roleNames.filter(role => !!role[Object.keys(role)[0]]).map(role => Object.keys(role)[0]),
      [],
    );
    this.store
      .dispatch(
        new CreateUser({
          ...this.form.value,
          roleNames: mappedRoleNames,
        })
      )
      .subscribe(() => {
        // this.list.get();
        this.message.success('修改客户信息成功');
      });
  }
}
