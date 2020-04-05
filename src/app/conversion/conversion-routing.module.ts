/** External import */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/** Internal import */
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { ConversionListComponent } from './conversion-list/conversion-list.component';
import { ConversionDetailComponent } from "./conversion-details/conversion-detail.component";

const routes: Routes = [
  {
    path: "",
    component: ConversionListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  },
  {
    path: "new",
    component: ConversionDetailComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversionRoutingModule { }
