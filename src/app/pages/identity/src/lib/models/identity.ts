import { ABP, PagedResultDto } from '@abp/ng.core';
import { IdentityRoleDto, IdentityUserDto } from '../proxy/identity/models';

// tslint:disable-next-line: no-namespace
export namespace Identity {
    export interface State {
        roles: PagedResultDto<IdentityRoleDto>;
        users: PagedResultDto<IdentityUserDto>;
        selectedRole: IdentityRoleDto;
        selectedUser: IdentityUserDto;
        selectedUserRoles: IdentityRoleDto[];
    }
}
