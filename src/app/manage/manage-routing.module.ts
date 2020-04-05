import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EmailSupportComponent } from './email-support/email-support.component';

const routes: Routes = [
  {
    path: 'change/password',
    component: ChangePasswordComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, featureName: 'CHANGEPASSWORD' } }
  },
  {
    path: 'change/password/:option',
    component: ChangePasswordComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, featureName: 'CHANGEPASSWORD' } }
  },
  {
    path: 'support/email',
    component: EmailSupportComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  },
  {
    path: 'support/email/:subject',
    component: EmailSupportComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  },
  {
    path: 'support/email/:subject/:message',
    component: EmailSupportComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
