//External Exports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Internal Exports
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { AuthorizeDeviceListComponent } from '@app/instant-formview/authorize-device-list/authorize-device-list.component';
import { TrustedDeviceListComponent } from '@app/instant-formview/trusted-device-list/trusted-device-list.component';
import { FormPreviewComponent } from '@app/instant-formview/form-preview/form-preview.component';
import {DeviceListComponent} from '@app/instant-formview/device-list/device-list.component';


const InstantFormViewRoutes: Routes = [
  /*{
    path: 'authorizeDevice',
    component: AuthorizeDeviceListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  },
  {
    path: 'trustedDeviceList',
    component: TrustedDeviceListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  },*/
  {
    path: 'device-list',
    component: DeviceListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  },
  {
    path: 'preview',
    component: FormPreviewComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  }
]

@NgModule({
  imports: [RouterModule.forChild(InstantFormViewRoutes)],
  exports: [RouterModule]
})

export class InstantFormviewRoutingModule {}
