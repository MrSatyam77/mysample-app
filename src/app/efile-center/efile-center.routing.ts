import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EfileBankComponent } from './efile-bank/efile-bank.component';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { EfilePrintListComponent } from './efile-print-list/efile-print-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: EfileBankComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_GET_EFILE_LIST'] } }
  },
  {
    path: 'list/:option',
    component: EfileBankComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_GET_EFILE_LIST'] } }
  },
  {
    path: 'approved/list',
    component: EfilePrintListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EfileCenterRoutingModule { }
