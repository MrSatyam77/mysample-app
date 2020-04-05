import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { PreferencesRoutingModule } from './preferences-routing.module';
import { PreferencesComponent } from './preferences/preferences.component';
import { PerOfficeConfigurationDialogComponent } from './dialogs/per-office-configuration-dialog/per-office-configuration-dialog.component';
import { ReturnWorkspacePreferencesComponent } from './components/return-workspace-preferences/return-workspace-preferences.component';
import { ClientOrganizerPreferencesComponent } from './components/client-organizer-preferences/client-organizer-preferences.component';
import { DisplayTextPipe } from '@app/shared/pipes';
import { DialogService } from '@app/shared/services';
import { ColorPreferencesComponent } from './components/color-preferences/color-preferences.component';
import { MiscellaneousPreferencesComponent } from './components/miscellaneous-preferences/miscellaneous-preferences.component';
import { ThemePreferencesComponent } from './components/theme-preferences/theme-preferences.component';


@NgModule({
  declarations: [PreferencesComponent, PerOfficeConfigurationDialogComponent, ReturnWorkspacePreferencesComponent, ClientOrganizerPreferencesComponent, DisplayTextPipe, ColorPreferencesComponent, MiscellaneousPreferencesComponent, ThemePreferencesComponent],
  imports: [
    NgbModule,
    ColorPickerModule,
    CommonModule,
    FormsModule,
    PreferencesRoutingModule
  ],
  providers: [DialogService],
  entryComponents: [
    PerOfficeConfigurationDialogComponent
  ]
})
export class PreferencesModule { }
