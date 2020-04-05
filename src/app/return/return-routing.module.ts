//External Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Internal Imports
import { ReturnBackupRestoreComponent } from './return-backup-restore/return-backup-restore.component';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { ReturnListComponent } from '@app/return/return-list/return-list.component';
import { NewReturnComponent } from '@app/return/new-return/new-return.component';

const routes: Routes = [
  {
    path: 'restore-backup',
    component: ReturnBackupRestoreComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_BACKUP_RETURN', 'CAN_LIST_RETURN', 'CAN_RESTORE_RETURN'] } }
  },
  {
    path: 'list',
    component: ReturnListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true },privileges: ['CAN_LIST_RETURN']  }
  },
  {
    path: 'list/:message?',
    component: ReturnListComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true },privileges: ['CAN_LIST_RETURN']  }
  },
  {
    path: 'restore-backup/:key',
    component: ReturnBackupRestoreComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_BACKUP_RETURN', 'CAN_LIST_RETURN', 'CAN_RESTORE_RETURN'] } }
  },
  {
    path: 'new',
    component: NewReturnComponent,
    canActivate: [AuthenticationGuard],
    data: { access: { requiredAuthentication: true, privileges: ['CAN_CREATE_RETURN', 'CAN_LIST_RETURN', 'CAN_OPEN_RETURN', 'CAN_SAVE_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_INTERVIEW', 'CAN_LIST_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS'] } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnRoutingModule { }
