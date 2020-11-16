import { ListService } from '@abp/ng.core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationUnitService } from '../../proxy/identity/organization-unit.service';
import { Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreateOrganizationUnit } from '../../actions/identity.actions';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-organization-unit',
  templateUrl: './create-organization-unit.component.html',
})
export class CreateOrganizationUnitComponent implements OnInit {
  @Input() parentId?: string;
  @Input() list: ListService;
  form: FormGroup;
  modalBusy: boolean;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private message: NzMessageService) {
  }
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    this.form = this.fb.group({
      parentId: [this.parentId || null, []],
      displayName: ['', [Validators.required, Validators.maxLength(256)]],
      extraProperties: this.fb.group({
        Identifier: ['', [Validators.required]]
      })
    });
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }
    this.modalBusy = true;
    this.store
      .dispatch(new CreateOrganizationUnit({ ...this.form.value }))
      .pipe(finalize(() => this.modalBusy = false))
      .subscribe(() => {
        this.list.get();
        this.message.success('创建客户成功');
      });
  }

}
