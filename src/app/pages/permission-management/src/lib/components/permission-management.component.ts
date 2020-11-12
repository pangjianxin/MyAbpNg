import { ApplicationConfiguration, ConfigState, GetAppConfiguration } from '@abp/ng.core';
import {
  AfterViewInit,
  Component,
  Input, OnInit, TrackByFunction, ViewChild
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode, NzTreeNodeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { Observable, of } from 'rxjs';
import { finalize, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { LocaleDirection } from 'src/app/pages/theme-shared/models/common';
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

  @Input() readonly providerName: string; // U：user,R:role等等

  @Input() readonly providerKey: string; // 目标的主键

  @Select(PermissionManagementState.getPermissionGroups) groups$: Observable<PermissionGroupDto[]>;

  @Select(PermissionManagementState.getEntityDisplayName) entityName$: Observable<string>;

  selectedGroup: PermissionGroupDto;

  permissions: PermissionGrantInfoDto[];

  get selectedGroupPermissions$(): Observable<PermissionWithStyle[]> {
    const margin = `margin-${(document.body.dir as LocaleDirection) === 'rtl' ? 'right' : 'left'
      }.px`;
    return this.groups$.pipe(
      // 如果有当前选中的组，则从state的groups$中找到这个当前组，并返回这个组包含的所有权限
      map(groups =>
        this.selectedGroup
          ? groups.find(group => group.name === this.selectedGroup.name).permissions
          : [],
      ),
      // 进而将返回的权限转换为一个包含style属性的权限超集
      map<PermissionGrantInfoDto[], PermissionWithStyle[]>(permissions =>
        permissions.map(
          permission =>
            (({
              ...permission,
              style: { [margin]: calculateMargin(permissions, permission) },
              isGranted: this.permissions.find(per => per.name === permission.name).isGranted,
            } as any) as PermissionWithStyle),
        ),
      ),
    );
  }

  constructor(private store: Store, private message: NzMessageService) { }

  ngOnInit(): void {
    this.init().subscribe();
  }
  // 这里判断权限是否还有其他提供者提供，如果有，那么这条记录是修改不了的，因为由其他的提供者所决定
  isGrantedByOtherProviderName(grantedProviders: ProviderInfoDto[]): boolean {
    if (grantedProviders.length) {
      return grantedProviders.findIndex(p => p.providerName !== this.providerName) > -1;
    }
    return false;
  }
  onChagePermissionGroup(group: PermissionGroupDto): void {
    this.selectedGroup = group;
  }

  onClickCheckbox(clickedPermission: PermissionGrantInfoDto, value: boolean): void {
    if (clickedPermission.isGranted && this.isGrantedByOtherProviderName(clickedPermission.grantedProviders)) {
      return;
    }
    setTimeout(() => {
      this.permissions = this.permissions.map(per => {
        if (clickedPermission.name === per.name) {
          return { ...per, isGranted: !per.isGranted };
        } else if (clickedPermission.name === per.parentName && clickedPermission.isGranted) {
          return { ...per, isGranted: false };
        } else if (clickedPermission.parentName === per.name && !clickedPermission.isGranted) {
          return { ...per, isGranted: true };
        }
        return per;
      });
    }, 0);
  }
  trackByFn: TrackByFunction<PermissionGroupDto> = (_, item) => item.name;

  submit(): void {
    const unchangedPermissions = getPermissions(
      this.store.selectSnapshot(PermissionManagementState.getPermissionGroups),
    );
    const changedPermissions: UpdatePermissionDto[] = this.permissions
      .filter(per =>
        unchangedPermissions.find(unchanged => unchanged.name === per.name).isGranted === per.isGranted
          ? false
          : true)
      .map(({ name, isGranted }) => ({ name, isGranted }));
    if (!changedPermissions.length) {
      //   this.visible = false;
      return;
    }
    //  this.modalBusy = true;
    this.store
      .dispatch(
        new UpdatePermissions({
          providerKey: this.providerKey,
          providerName: this.providerName,
          permissions: changedPermissions,
        }),
      )
      .pipe(
        switchMap(() =>
          this.shouldFetchAppConfig() ? this.store.dispatch(GetAppConfiguration) : of(null)))
      .subscribe(() => {
        this.message.success('操作成功');
      });
  }
  shouldFetchAppConfig(): boolean {
    const currentUser = this.store.selectSnapshot(
      ConfigState.getOne('currentUser'),
    ) as ApplicationConfiguration.CurrentUser;

    if (this.providerName === 'R') {
      return currentUser.roles.some(role => role === this.providerKey);
    }

    if (this.providerName === 'U') {
      return currentUser.id === this.providerKey;
    }

    return false;
  }

  init(): Observable<any> {
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
          console.log(permissionRes);
          this.selectedGroup = permissionRes.groups[0];
          this.permissions = getPermissions(permissionRes.groups);
        }),
      );
  }
}
function getPermissions(groups: PermissionGroupDto[]): PermissionGrantInfoDto[] {
  return groups.reduce((acc, val) => [...acc, ...val.permissions], []);
}

function calculateMargin(
  permissions: PermissionGrantInfoDto[],
  permission: PermissionGrantInfoDto,
): number {
  const parentPermission = permissions.find(per => per.name === permission.parentName);

  if (parentPermission && parentPermission.parentName) {
    let margin = 20;
    return (margin += calculateMargin(permissions, parentPermission));
  }

  return parentPermission ? 20 : 0;
}
