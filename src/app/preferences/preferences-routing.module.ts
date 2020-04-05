import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreferencesComponent } from './preferences/preferences.component';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { CanDeactivateGuard } from '@app/shared/guards/canDeactivate.guard';
const routes: Routes = [
  {
    path: ':screen',
    component: PreferencesComponent,
    canActivate: [AuthenticationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { access: { requiredAuthentication: true } }
  },
  {
    path: ':screen/:option',
    component: PreferencesComponent,
    canActivate: [AuthenticationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { access: { requiredAuthentication: true } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferencesRoutingModule { }
