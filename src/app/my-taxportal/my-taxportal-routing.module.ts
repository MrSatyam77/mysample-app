import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTaxportalSettingsComponent } from './my-taxportal-settings/my-taxportal-settings.component';
import { ClientquestionformComponent } from "./dialogs/clientquestionform/clientquestionform.component";
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { ManageInvitedClientsComponent } from './manage-invited-clients/manage-invited-clients.component';
import { InviteClientsComponent } from './invite-clients/invite-clients.component';

const routes: Routes = [
  {
    path: 'settings',
    component: MyTaxportalSettingsComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_VIEW_CLIENT_SETTING'] } }
  },
  {
    path: 'invite-clients',
    component: InviteClientsComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_INVITE_CLIENT'] } }
  },
  {
    path: 'manage-invited-clients',
    component: ManageInvitedClientsComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_VIEW_INVITED_CLIENT'] } }
  },
  {
    path: 'questionsset',
    component: ClientquestionformComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_VIEW_CLIENT_SETTING'] } }
  },
  {
    path: 'questionsset/:Id',
    component: ClientquestionformComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_VIEW_CLIENT_SETTING'] } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTaxportalRoutingModule { }
