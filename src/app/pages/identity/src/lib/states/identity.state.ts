import { ListResultDto, PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import {
    CreateOrganizationUnit,
    CreateRole,
    CreateUser,
    DeleteOrganizationUnit,
    DeleteRole,
    DeleteUser,
    GetOrganizationUnitById,
    GetOrganizationUnits,
    GetRoleById,
    GetRoles,
    GetUserById,
    GetUserRoles,
    GetUsers,
    UpdateOrganizationUnit,
    UpdateRole,
    UpdateUser,
} from '../actions/identity.actions';
import { Identity } from '../models/identity';
import { OrganizationUnitService } from '../proxy/identity';
import { IdentityRoleService } from '../proxy/identity/identity-role.service';
import { IdentityUserService } from '../proxy/identity/identity-user.service';
import { IdentityRoleDto, IdentityUserDto, OrganizationUnitDto } from '../proxy/identity/models';

@State<Identity.State>({
    name: 'IdentityState',
    defaults: {
        roles: {},
        selectedRole: {},
        users: {},
        selectedUser: {},
        organizationUnits: {},
        selectedOrganizationUnit: {}
    } as Identity.State,
})
@Injectable()
export class IdentityState {
    @Selector()
    static getRoles({ roles }: Identity.State): IdentityRoleDto[] {
        return roles.items || [];
    }

    @Selector()
    static getRolesTotalCount({ roles }: Identity.State): number {
        return roles.totalCount || 0;
    }

    @Selector()
    static getUsers({ users }: Identity.State): IdentityUserDto[] {
        return users.items || [];
    }

    @Selector()
    static getUsersTotalCount({ users }: Identity.State): number {
        return users.totalCount || 0;
    }

    @Selector()
    static getOrgnaizationUnits({ organizationUnits }: Identity.State): OrganizationUnitDto[] {
        return organizationUnits.items;
    }

    @Selector()
    static getOrganizationUnitsTotalCount({ organizationUnits }: Identity.State): number {
        return organizationUnits.totalCount;
    }

    constructor(
        private identityUserService: IdentityUserService,
        private identityRoleService: IdentityRoleService,
        private identityOUService: OrganizationUnitService) { }

    @Action(GetRoles)
    getRoles({ patchState }: StateContext<Identity.State>, { payload }: GetRoles)
        : Observable<PagedResultDto<IdentityRoleDto>> {
        return this.identityRoleService.getList(payload).pipe(
            tap(roles =>
                patchState({
                    roles,
                }),
            ),
        );
    }

    @Action(GetRoleById)
    getRole({ patchState }: StateContext<Identity.State>, { payload }: GetRoleById)
        : Observable<IdentityRoleDto> {
        return this.identityRoleService.get(payload).pipe(
            tap(selectedRole =>
                patchState({
                    selectedRole,
                }),
            ),
        );
    }

    @Action(DeleteRole)
    deleteRole(_, { payload }: GetRoleById): Observable<void> {
        return this.identityRoleService.delete(payload);
    }

    @Action(CreateRole)
    addRole(_, { payload }: CreateRole): Observable<IdentityRoleDto> {
        return this.identityRoleService.create(payload);
    }

    @Action(UpdateRole)
    updateRole({ getState }: StateContext<Identity.State>, { payload }: UpdateRole)
        : Observable<IdentityRoleDto> {
        return this.identityRoleService.update(payload.id, { ...getState().selectedRole, ...payload });
    }

    @Action(GetUsers)
    getUsers({ patchState }: StateContext<Identity.State>, { payload }: GetUsers): Observable<PagedResultDto<IdentityUserDto>> {
        return this.identityUserService.getList(payload).pipe(
            tap(users =>
                patchState({
                    users,
                }),
            ),
        );
    }

    @Action(GetUserById)
    getUser({ patchState }: StateContext<Identity.State>, { payload }: GetUserById): Observable<IdentityUserDto> {
        return this.identityUserService.get(payload).pipe(
            tap(selectedUser =>
                patchState({
                    selectedUser,
                }),
            ),
        );
    }

    @Action(DeleteUser)
    deleteUser(_, { payload }: GetUserById): Observable<void> {
        return this.identityUserService.delete(payload);
    }

    @Action(CreateUser)
    addUser(_, { payload }: CreateUser): Observable<IdentityUserDto> {
        return this.identityUserService.create(payload);
    }

    @Action(UpdateUser)
    updateUser({ getState }: StateContext<Identity.State>, { payload }: UpdateUser): Observable<IdentityUserDto> {
        return this.identityUserService.update(payload.id, { ...getState().selectedUser, ...payload });
    }

    @Action(GetUserRoles)
    getUserRoles({ patchState }: StateContext<Identity.State>, { payload }: GetUserRoles): Observable<IdentityRoleDto[]> {
        return this.identityUserService.getRoles(payload).pipe(
            pluck('items'),
            tap(selectedUserRoles =>
                patchState({
                    selectedUserRoles,
                }),
            ),
        );
    }

    @Action(GetOrganizationUnits)
    getOrganizationUnits({ patchState }: StateContext<Identity.State>, { payload }: GetOrganizationUnits)
        : Observable<PagedResultDto<OrganizationUnitDto>> {

        return this.identityOUService.getList(payload).pipe(
            tap(organizationUnits => {
                patchState({
                    organizationUnits
                });
            })
        );
    }

    @Action(GetOrganizationUnitById)
    getOrganizationUnitById({ patchState }: StateContext<Identity.State>, { payload }: GetOrganizationUnitById)
        : Observable<OrganizationUnitDto> {
        return this.identityOUService.get(payload).pipe(
            tap(
                selectedOrganizationUnit => {
                    patchState({
                        selectedOrganizationUnit
                    });
                }
            ));
    }

    @Action(DeleteOrganizationUnit)
    deleteOrganizationUnit(_, { payload }: DeleteOrganizationUnit): Observable<void> {
        return this.identityOUService.delete(payload);
    }

    @Action(UpdateOrganizationUnit)
    updateOrganizationUnit({ getState }: StateContext<Identity.State>, { payload }: UpdateOrganizationUnit)
        : Observable<OrganizationUnitDto> {
        return this.identityOUService.update(payload.id, { ...getState().selectedOrganizationUnit, ...payload });
    }

    @Action(CreateOrganizationUnit)
    createOrganizationUnit(_, { payload }: CreateOrganizationUnit)
        : Observable<OrganizationUnitDto> {
        return this.identityOUService.create(payload);
    }
}
