import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterOutletComponent, AuthGuard, PermissionGuard } from '@abp/ng.core';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'roles', pathMatch: 'full' },
  {
    path: '',
    component: RouterOutletComponent,
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          requiredPolicy: 'AbpIdentity.Roles',
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          requiredPolicy: 'AbpIdentity.Users',
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityRoutingModule { }
