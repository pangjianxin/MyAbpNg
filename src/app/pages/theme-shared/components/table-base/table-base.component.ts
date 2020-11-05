import { Component } from '@angular/core';
import { ExtensibleFullAuditedEntityDto } from '@abp/ng.core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ListService } from '@abp/ng.core';
@Component({
  selector: 'app-table-base',
  template: ''
})
export class TableBaseComponent<TEntity extends ExtensibleFullAuditedEntityDto<string>> {

  listOfSelection = [
    {
      text: '选择所有行',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: '选择偶数行',
      onSelect: () => {
        this.grid.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: '选择奇数行',
      onSelect: () => {
        this.grid.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  checked = false;
  indeterminate = false;
  visible = false;
  grid: TEntity[];
  pageIndex = 0;
  pageSize = 10;
  total: number;
  loading = false;
  setOfCheckedId = new Set<string>();
  constructor(protected list: ListService) {
  }
  get isOnlyOneSelected(): boolean {
    return this.setOfCheckedId.size === 1;
  }
  // getData(url: string, sieveModel: SieveModel) {
  //   this.serivce.gridAsync(url, sieveModel).subscribe(value => {
  //     this.grid = value.list;
  //     this.pageSize = value.parameters.pageSize;
  //     this.pageIndex = value.parameters.page;
  //     this.total = value.count;
  //   });
  // }

  onQueryParamsChange($event: NzTableQueryParams): void {
    const sort = $event.sort.filter(it => !!it.value)[0];
    if (sort) {
      switch (sort.value) {
        case 'ascend':
          sort.value = 'asc';
          break;
        default:
          sort.value = 'desc';
          break;
      }
    }
    this.list.page = $event.pageIndex;
    this.list.maxResultCount = $event.pageSize === 0 ? 10 : $event.pageSize;
    this.list.sortKey = sort?.key;
    this.list.sortOrder = sort?.value;
    this.list.filter = $event.filter[0]?.value;
  }
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  refreshCheckedStatus(): void {
    this.checked = this.grid.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.grid.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.grid.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

}
