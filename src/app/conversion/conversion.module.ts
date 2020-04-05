/** External import */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from "ag-grid-angular";
import { FormsModule } from "@angular/forms";
/** Internal import */
import { ConversionService } from "./conversion.service";
import { DialogService } from "@app/shared/services/dialog.service";
import { ConversionDetailService } from "./conversion-details/conversion-detail.service";
import { ConversionRoutingModule } from './conversion-routing.module';

import { SharedModule } from '@app/shared/shared.module';
import { ConversionListComponent } from './conversion-list/conversion-list.component';
import { ConversionDetailComponent } from './conversion-details/conversion-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BackupInstructionsComponent } from './components/backup-instructions/backup-instructions.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { SoftwareSelectionComponent } from './components/software-selection/software-selection.component';
import { UploadComponent } from './components/upload/upload.component';
import { FileValidationComponent } from './dialogs/filevalidation/filevalidation.component';
import { FilesConflictsComponent } from './dialogs/files-conflicts/files-conflicts.component';
import { ConvertSizePipe } from "./convert-size.pipe";

@NgModule({
  declarations: [
    FileValidationComponent,
    ConversionListComponent,
    ConversionDetailComponent,
    WelcomeComponent,
    BackupInstructionsComponent,
    ConfirmationComponent,
    InstructionsComponent,
    SoftwareSelectionComponent,
    UploadComponent,
    FilesConflictsComponent,
    ConvertSizePipe
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    ConversionRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers: [ConversionService, DialogService, ConversionDetailService , ConvertSizePipe],
  entryComponents: [FileValidationComponent, FilesConflictsComponent]
})
export class ConversionModule { }
