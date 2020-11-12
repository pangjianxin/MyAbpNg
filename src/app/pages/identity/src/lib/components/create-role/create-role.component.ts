import { ListService } from '@abp/ng.core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { CreateRole } from '../../actions/identity.actions';


@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html'
})
export class CreateRoleComponent implements OnInit {

  @Input() list: ListService;

  form: FormGroup;

  modalBusy: boolean;

  constructor(private fb: FormBuilder,
    private store: Store,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(256)]],
      isDefault: [false],
      isPublic: [false],
    });
  }
  submit(): void {
    if (!this.form.valid) {
      return;
    }
    this.modalBusy = true;

    this.store
      .dispatch(new CreateRole(this.form.value),)
      .pipe(finalize(() => (this.modalBusy = false)))
      .subscribe(() => {
        this.list.get();
        this.message.success('创建成功');
      });
  }
}
