import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TenantDto, TenantService } from '../../proxy';
import { Store } from '@ngxs/store';
import { finalize, take } from 'rxjs/operators';
@Component({
  selector: 'app-manage-tenant-connection-string',
  templateUrl: './manage-tenant-connection-string.component.html',
})
export class ManageTenantConnectionStringComponent implements OnInit {

  @Input() selectedTenant: TenantDto;

  @Input() fetchedConnectionString: string;

  modalBusy: boolean;

  defaultConnectionStringForm: FormGroup;

  // 从表单中获取
  get useSharedDatabase(): boolean {
    return this.defaultConnectionStringForm.get('useSharedDatabase').value;
  }
  // 从表单中获取
  get connectionString(): string {
    return this.defaultConnectionStringForm.get('defaultConnectionString').value;
  }

  constructor(private fb: FormBuilder,
    private message: NzMessageService, private tenantService: TenantService) { }

  ngOnInit(): void {
    this.createDefaultConnectionStringForm();
  }

  private createDefaultConnectionStringForm(): void {
    this.defaultConnectionStringForm = this.fb.group({
      useSharedDatabase: this.fetchedConnectionString ? false : true,
      defaultConnectionString: [this.fetchedConnectionString ? this.fetchedConnectionString : ''],
    });
  }

  save(): void {
    if (this.modalBusy) {
      return;
    }
    this.modalBusy = true;
    // 如果设置使用共享数据库，则删除数据库中已存在的数据库连接字符串
    if (this.useSharedDatabase || (!this.useSharedDatabase && !this.connectionString)) {
      this.tenantService
        .deleteDefaultConnectionString(this.selectedTenant.id)
        .pipe(take(1), finalize(() => (this.modalBusy = false)))
        .subscribe(() => {
          this.message.success('操作成功');
        });
    } else { // 否则,使用表单中填写的连接字符串进行更新
      this.tenantService
        .updateDefaultConnectionString(this.selectedTenant.id, this.connectionString)
        .pipe(take(1), finalize(() => (this.modalBusy = false)))
        .subscribe(() => {
          this.message.success('操作成功');
        });
    }
  }
  onSharedDatabaseChange(value: boolean): void {
    console.log(value);
    if (!value) {
      setTimeout(() => {
        const defaultConnectionString = document.getElementById(
          'defaultConnectionString',
        ) as HTMLInputElement;
        if (defaultConnectionString) {
          defaultConnectionString.focus();
        }
      }, 0);
    }
  }
}
