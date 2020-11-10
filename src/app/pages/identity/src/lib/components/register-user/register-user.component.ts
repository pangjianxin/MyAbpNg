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
  templateUrl: './register-user.component.html',
})
export class RegisterUserComponent implements OnInit {
  form: FormGroup;
  assignableRoles: IdentityRoleDto[];
  inProgress: boolean;
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
        userName: ['', [Validators.required, Validators.maxLength(256)]],
        name: ['', [Validators.maxLength(64)]],
        surname: ['', [Validators.maxLength(64)]],
        email: ['', [Validators.email, Validators.maxLength(256), Validators.required]],
        phoneNumber: ['', [Validators.maxLength(16)]],
        lockoutEnabled: [false],
        roleNames: [Array.from(''), [Validators.minLength(1)]],
        password: ['', [...passwordValidators, Validators.required]]
      });
    });
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form.value);
    this.store
      .dispatch(
        new CreateUser({
          ...this.form.value,
        })
      )
      .subscribe(() => {
        this.message.success('创建客户成功');
      });
  }
}
