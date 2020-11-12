import { ListService } from '@abp/ng.core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IdentityRoleDto } from '../../proxy/identity';
import { Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UpdateRole } from '../../actions/identity.actions';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
})
export class EditRoleComponent implements OnInit {

  @Input() list: ListService;

  @Input() selectedRole: IdentityRoleDto;

  form: FormGroup;

  modalBusy: boolean;

  constructor(private fb: FormBuilder,
    private store: Store,
    private message: NzMessageService) { }

  ngOnInit(): void {
    console.log(this.selectedRole);
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: new FormControl({ value: this.selectedRole.name || '', disabled: this.selectedRole.isStatic }, [
        Validators.required,
        Validators.maxLength(256),
      ]),
      isDefault: [this.selectedRole.isDefault || false],
      isPublic: [this.selectedRole.isPublic || false],
    });
  }
  submit(): void {
    if (!this.form.valid) {
      return;
    }
    this.modalBusy = true;
    this.store
      .dispatch(new UpdateRole({ ...this.selectedRole, ...this.form.value, id: this.selectedRole.id }))
      .pipe(finalize(() => (this.modalBusy = false)))
      .subscribe(() => {
        this.list.get();
        this.message.success('修改成功');
      });
  }
}
