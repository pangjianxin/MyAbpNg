import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import {
    GetIdentityUsersInput,
    GetOrganizationUnitsInput,
    IdentityRoleCreateDto,
    IdentityRoleUpdateDto,
    IdentityUserCreateDto,
    IdentityUserUpdateDto,
    OrganizationUnitCreateDto,
    OrganizationUnitUpdateDto,
} from '../proxy/identity/models';

export class GetRoles {
    static readonly type = '[Identity] Get Roles';
    constructor(public payload?: PagedAndSortedResultRequestDto) { }
}

export class GetRoleById {
    static readonly type = '[Identity] Get Role By Id';
    constructor(public payload: string) { }
}

export class DeleteRole {
    static readonly type = '[Identity] Delete Role';
    constructor(public payload: string) { }
}

export class CreateRole {
    static readonly type = '[Identity] Create Role';
    constructor(public payload: IdentityRoleCreateDto) { }
}

export class UpdateRole {
    static readonly type = '[Identity] Update Role';
    constructor(public payload: IdentityRoleUpdateDto & { id: string }) { }
}

export class GetUsers {
    static readonly type = '[Identity] Get Users';
    constructor(public payload?: GetIdentityUsersInput) { }
}

export class GetUserById {
    static readonly type = '[Identity] Get User By Id';
    constructor(public payload: string) { }
}

export class DeleteUser {
    static readonly type = '[Identity] Delete User';
    constructor(public payload: string) { }
}

export class CreateUser {
    static readonly type = '[Identity] Create User';
    constructor(public payload: IdentityUserCreateDto) { }
}

export class UpdateUser {
    static readonly type = '[Identity] Update User';
    constructor(public payload: IdentityUserUpdateDto & { id: string }) { }
}

export class GetUserRoles {
    static readonly type = '[Identity] Get User Roles';
    constructor(public payload: string) { }
}

export class GetOrganizationUnits {
    static readonly type = '[Identity] Get Organization Units';
    constructor(public payload: PagedAndSortedResultRequestDto) { }
}

export class GetOrganizationUnitById {
    static readonly type = '[Identity] Get Organization Unit By Id ';
    constructor(public payload: string) { }
}

export class DeleteOrganizationUnit {
    static readonly type = '[Identity] Delete Organization Unit';
    constructor(public payload: string) { }
}

export class CreateOrganizationUnit {
    static readonly type = '[Identity] Create Organization Unit';
    constructor(public payload: OrganizationUnitCreateDto) { }
}

export class UpdateOrganizationUnit {
    static readonly type = '[Identity] Update Organization Unit';
    constructor(public payload: OrganizationUnitUpdateDto & { id: string }) { }
}
