//External Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Internal Imports
import {DeviceListComponent} from '@app/signature/signature-device-list/signature-device-list.component';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';

const routes: Routes = [
  {
    path: 'list',
    component: DeviceListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true }, privileges: ['CAN_LIST_DEVICE'], featureName: "SIGNATURE" }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SignatureRoutingModule { }
