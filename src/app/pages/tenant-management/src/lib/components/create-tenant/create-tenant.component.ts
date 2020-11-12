import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getPasswordValidators } from 'src/app/pages/theme-shared/uitls/validation.utils';
import { Store } from '@ngxs/store';
import { CreateTenant } from '../../actions';
import { finalize } from 'rxjs/operators';
import { ListService } from '@abp/ng.core';

@Component({
  selector: 'app-create-tenant',
  templateUrl: './create-tenant.component.html',
})
export class CreateTenantComponent implements OnInit {

  @Input() list: ListService;

  modalBusy: boolean;

  tenantForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.createTenantForm();
  }
  private createTenantForm(): void {
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(256)]],
      adminEmailAddress: [null, [Validators.required, Validators.maxLength(256), Validators.email]],
      adminPassword: [null, [Validators.required, ...getPasswordValidators(this.store)]],
    });
  }
  // 保存租户
  submit(): void {
    if (!this.tenantForm.valid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;

    this.store
      .dispatch(new CreateTenant(this.tenantForm.value))
      .pipe(finalize(() => (this.modalBusy = false)))
      .subscribe(() => {
        this.list.get();
      });
  }
}
