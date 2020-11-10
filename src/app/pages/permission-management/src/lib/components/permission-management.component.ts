import { ApplicationConfiguration, ConfigState, GetAppConfiguration } from '@abp/ng.core';
import {
  AfterViewInit,
  Component,
  Input, OnInit, ViewChild
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode, NzTreeNodeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { Observable, of } from 'rxjs';
import { finalize, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { GetPermissions, UpdatePermissions } from '../actions/permission-management.actions';
import { GetPermissionListResultDto, PermissionGrantInfoDto, PermissionGroupDto, ProviderInfoDto, UpdatePermissionDto } from '../proxy/models';
import { PermissionManagementState } from '../states/permission-management.state';

type PermissionWithStyle = PermissionGrantInfoDto & {
  style: string;
};

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
})
export class PermissionManagementComponent implements OnInit {

  permissionCheckedKeys: string[];

  @Input() readonly providerName: string; // U：user,R:role等等

  @Input() readonly providerKey: string; // 目标的主键

  @Input() readonly hideBadges = false;

  @Select(PermissionManagementState.getPermissionGroups) groups$: Observable<PermissionGroupDto[]>;

  @Select(PermissionManagementState.getEntityDisplayName) entityName$: Observable<string>;

  @ViewChild('permissionTree', { static: false, read: NzTreeComponent }) permissionTree: NzTreeComponent;

  selectedGroup: NzTreeNodeOptions[];

  permissions: PermissionGrantInfoDto[];


  constructor(private store: Store) { }
  ngOnInit(): void {
    this.initTree().subscribe();
  }
  nzEvent(event: NzFormatEmitEvent): void {
    const candidatePermissionList = [];
    const updatedNode: NzTreeNodeOptions = event.node.origin;
    if (updatedNode.isLeaf) {
      const parentNodeHasThisStatus = this.permissionTree.getCheckedNodeList().some(it => it.key === event.node.parentNode.key);
      console.log(parentNodeHasThisStatus);
      if (!parentNodeHasThisStatus) {
        candidatePermissionList.push(event.node.parentNode.key);
      }
      candidatePermissionList.push(updatedNode.key);
    } else {
      candidatePermissionList.push(updatedNode.key);
      updatedNode.children.forEach(element => {
        candidatePermissionList.push(element.key);
      });
    }
    candidatePermissionList.forEach(element => {
      const index = this.permissionCheckedKeys.indexOf(element);
      if (index > -1) {
        this.permissionCheckedKeys.splice(index, 1);
      } else {
        this.permissionCheckedKeys.push(element);
      }
    });

    console.log(this.permissionCheckedKeys);
    // console.log(event);

    // console.log(this.permissionTree.getHalfCheckedNodeList());

    // 如果是节点的话就删除/或增加节点下所有的数
    // if (!event.node.origin.isLeaf) {
    //   const indexN = this.permissionCheckedKeys.indexOf(event.node.origin.key);
    //   if (indexN > -1) {// 大于-1表示存在
    //     this.permissionCheckedKeys.splice(indexN, 1);
    //     event.node.origin.children.forEach(value => {
    //       const i = this.permissionCheckedKeys.indexOf(event.node.origin.key);
    //       if (i > -1) {
    //         this.permissionCheckedKeys.splice(i, 1);
    //       }
    //     });
    //   } else {
    //     this.permissionCheckedKeys.push(event.node.origin.key);
    //     event.node.origin.children.forEach(value => {
    //       this.permissionCheckedKeys.push(value.key);
    //     });
    //   }
    // }
    // const index = this.permissionCheckedKeys.indexOf(event.node.origin.key);
    // if (index > -1) {
    //   this.permissionCheckedKeys.splice(index, 1);
    // } else {
    //   this.permissionCheckedKeys.push(event.node.origin.key);
    // }



  }
  submit(): void {
    const unchangedPermissions = getPermissions(
      this.store.selectSnapshot(PermissionManagementState.getPermissionGroups),
    );
    // const changedPermissions: UpdatePermissionDto[] = this.permissions
    //   .filter(per =>
    //     unchangedPermissions.find(unchanged => unchanged.name === per.name).isGranted ===
    //       per.isGranted
    //       ? false
    //       : true,
    //   )
    //   .map(({ name, isGranted }) => ({ name, isGranted }));

    // if (!changedPermissions.length) {
    //   this.visible = false;
    //   return;
    // }

    // this.modalBusy = true;
    // this.store
    //   .dispatch(
    //     new UpdatePermissions({
    //       providerKey: this.providerKey,
    //       providerName: this.providerName,
    //       permissions: changedPermissions,
    //     }),
    //   )
    //   .pipe(
    //     switchMap(() =>
    //       this.shouldFetchAppConfig() ? this.store.dispatch(GetAppConfiguration) : of(null),
    //     ),
    //     // finalize(() => (this.modalBusy = false)),
    //   )
    //   .subscribe(() => {
    //     //  this.visible = false;
    //   });
  }
  // shouldFetchAppConfig(): boolean {
  //   const currentUser = this.store.selectSnapshot(
  //     ConfigState.getOne('currentUser'),
  //   ) as ApplicationConfiguration.CurrentUser;

  //   if (this.providerName === 'R') {
  //     return currentUser.roles.some(role => role === this.providerKey);
  //   }

  //   if (this.providerName === 'U') {
  //     return currentUser.id === this.providerKey;
  //   }

  //   return false;
  // }

  initTree(): Observable<any> {
    if (!this.providerKey || !this.providerName) {
      throw new Error('Provider Key and Provider Name are required.');
    }
    return this.store
      .dispatch(
        new GetPermissions({
          providerKey: this.providerKey,
          providerName: this.providerName,
        }),
      ).pipe(
        pluck('PermissionManagementState', 'permissionRes'),
        tap((permissionRes: GetPermissionListResultDto) => {
          this.selectedGroup = permissionGroupMap(permissionRes.groups[0]);
          this.permissions = getPermissions(permissionRes.groups);
          this.permissionCheckedKeys = this.permissions.map(value => {
            if (value.isGranted) {
              return value.name;
            }
          });
        }),
      );
  }

  showPermissionPanel(group: PermissionGroupDto): void {
    this.selectedGroup = permissionGroupMap(group);
    this.permissionCheckedKeys = [...this.permissionCheckedKeys];
    console.log(this.permissionCheckedKeys);
  }
}
function getPermissions(groups: PermissionGroupDto[]): PermissionGrantInfoDto[] {
  return groups.reduce((acc, val) => [...acc, ...val.permissions], []);
}

function permissionGroupMap(group: PermissionGroupDto): NzTreeNodeOptions[] {
  // const permissionNodes: { [key: string]: NzTreeNode } = {};
  // group.permissions.forEach(value => {
  //   if (value.parentName) {
  //     permissionNodes[value.name] = new NzTreeNode({
  //       title: value.displayName,
  //       key: value.name,
  //       isLeaf: true,
  //       parentNode: permissionNodes[value.parentName]
  //     });
  //   } else {
  //     permissionNodes[value.name] = new NzTreeNode({
  //       title: value.displayName,
  //       key: value.name,
  //       isLeaf: true
  //     });
  //   }
  // });
  // Object.values(permissionNodes);
  // return [...Object.values(permissionNodes)];
  const parentNodes: NzTreeNodeOptions[] = group.permissions
    .filter(it => !it.parentName)
    .map(item => {
      return { title: item.displayName, key: item.name, expanded: true, isLeaf: false, children: [] }
    });
  parentNodes.forEach(value => {
    group.permissions.forEach(it => {
      if (it.parentName === value.key) {
        value.children.push({ title: it.displayName, key: it.name, isLeaf: true });
      }
    });
  });
  return parentNodes;
}


