// External Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';
import { FormsModule } from '@angular/forms';

// Internal Imports
import { NewReturnComponent } from '@app/return/new-return/new-return.component';
import { ReturnRoutingModule } from '@app/return/return-routing.module';
import { K1ImportComponent } from '@app/return/dialogs/k1-import/k1-import.component';
import { DialogService } from '@app/shared/services/dialog.service';
import { ProformaCheckComponent } from '@app/return/dialogs/proforma-check/proforma-check.component';
import { CoreModule } from '@app/core/core.module';
import { ReturnBackupRestoreComponent } from '@app/return/return-backup-restore/return-backup-restore.component';
import { BackupReturnComponent } from '@app/return/components/backup-return/backup-return.component';
import { RestoreReturnComponent } from '@app/return/components/restore-return/restore-return.component';
import { ReturnListComponent } from '@app/return/return-list/return-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { CustomReturnStatusComponent } from '@app/return/dialogs/custom-return-status/custom-return-status.component';

// mask module default config
export const maskingOptions: Partial<IConfig> | (() => Partial<IConfig>) = {
  showMaskTyped: true,
  dropSpecialCharacters: false
};

@NgModule({
  declarations: [
    NewReturnComponent,
    K1ImportComponent,
    ProformaCheckComponent, 
    ReturnBackupRestoreComponent, 
    BackupReturnComponent, 
    RestoreReturnComponent, 
    ReturnListComponent, 
    CustomReturnStatusComponent
  ],
  imports: [
    CommonModule,
    ReturnRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxUploaderModule,
    SharedModule,
    CoreModule,
    FormsModule,
    NgxMaskModule.forChild(maskingOptions)
  ],
  providers: [DialogService],
  entryComponents: [
    K1ImportComponent,
    ProformaCheckComponent,
    CustomReturnStatusComponent
  ]
})
export class ReturnModule { }
