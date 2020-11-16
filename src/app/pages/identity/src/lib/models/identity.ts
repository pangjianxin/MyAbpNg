import { ABP, PagedResultDto } from '@abp/ng.core';
import { IdentityRoleDto, IdentityUserDto, OrganizationUnitDto } from '../proxy/identity/models';

// tslint:disable-next-line: no-namespace
export namespace Identity {
    export interface State {
        roles: PagedResultDto<IdentityRoleDto>;
        users: PagedResultDto<IdentityUserDto>;
        organizationUnits: PagedResultDto<OrganizationUnitDto>;
        selectedRole: IdentityRoleDto;
        selectedUser: IdentityUserDto;
        selectedOrganizationUnit: OrganizationUnitDto;
        selectedUserRoles: IdentityRoleDto[];
    }
}
