import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TenantDto } from '../../proxy';
import { Store } from '@ngxs/store';
import { UpdateTenant } from '../../actions';
import { finalize } from 'rxjs/operators';
import { ListService } from '@abp/ng.core';

@Component({
  selector: 'app-edit-tenant',
  templateUrl: './edit-tenant.component.html',
})
export class EditTenantComponent implements OnInit {

  @Input() selectedTenant: TenantDto;

  @Input() list: ListService;

  tenantForm: FormGroup;

  modalBusy: boolean;

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.createTenantForm();
  }
  private createTenantForm(): void {
    this.tenantForm = this.fb.group({
      name: [this.selectedTenant.name || '', [Validators.required, Validators.maxLength(256)]],
    });
  }
  submit(): void {
    if (!this.tenantForm.valid || this.modalBusy) {
      return;
    }
    this.modalBusy = true;

    this.store
      .dispatch(new UpdateTenant({ ...this.selectedTenant, ...this.tenantForm.value, id: this.selectedTenant.id }))
      .pipe(finalize(() => (this.modalBusy = false)))
      .subscribe(() => {
        this.list.get();
      });
  }
}
