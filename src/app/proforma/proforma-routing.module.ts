//External imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Internal imports
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { ProformaListComponent } from '@app/proforma/proforma-list/proforma-list.component';
import { ProformanewComponent} from '@app/proforma/proforma-new/proforma-new.component';

const routes: Routes = [
  {
    path: 'list',
    component: ProformaListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true },  privileges: ['CAN_LIST_PROFORMA'] }
  },
  {
    path: 'new',
    component: ProformanewComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } , privileges: ['CAN_LIST_PROFORMA']}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProformaRoutingModule { }
