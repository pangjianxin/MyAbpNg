import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterOutletComponent, AuthGuard, PermissionGuard } from '@abp/ng.core';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'roles', pathMatch: 'full' },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      requiredPolicy: 'AbpIdentity.Roles',
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      requiredPolicy: 'AbpIdentity.Users',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityRoutingModule { }
