/** External import */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Internal import */
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { RoleEditComponent } from '@app/role/role-edit/role-edit.component';
import { RoleListComponent } from '@app/role/role-list/role-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: RoleListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_LIST_ROLE'] } }
  },
  {
    path: 'edit',
    component: RoleEditComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_OPEN_ROLE', 'CAN_CREATE_ROLE', 'CAN_SAVE_ROLE', 'CAN_REMOVE_ROLE'] } }
  },
  {
    path: 'edit/:id',
    component: RoleEditComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_OPEN_ROLE', 'CAN_CREATE_ROLE', 'CAN_SAVE_ROLE', 'CAN_REMOVE_ROLE'] } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
