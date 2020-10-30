import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';

const routes: Routes = [
  { path: 'manage-profile', component: ManageProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
