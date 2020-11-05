import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthenticationFlowGuard } from './guards/authentication-flow.guard';
import { RouterOutletComponent, AuthGuard } from '@abp/ng.core';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthenticationFlowGuard],
        data: {

        }
      },
      {
        path: 'manage-profile',
        component: ManageProfileComponent,
        canActivate: [AuthGuard],
        data: {

        }
      }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
