// External Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router"
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxQRCodeModule } from 'ngx-qrcode2';

// Internal Imports
import { NavigatorUserInstructionComponent } from '@app/shared/components/navigator-user-instruction/navigator-user-instruction.component';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NotifyDialogComponent } from '@app/shared/components/notify-dialog/notify-dialog.component';
import { PrivilegesInfoComponent } from '@app/shared/components/privileges-info/privileges-info.component';
import { ToastContainerComponent } from '@app/shared/components/toast-container/toast-container.component';
import { TimeOutWarningComponent } from '@app/shared/components/time-out-warning/time-out-warning.component';
import { TaxSession24hoursWarningComponent } from '@app/shared/components/tax-session24hours-warning/tax-session24hours-warning.component';
import { TaxIdleDirective } from '@app/shared/directives/tax-idle.directive';
import { TaxSession24Directive } from '@app/shared/directives/tax-session24.directive';
import { TaxSession24WarningTimerDirective } from '@app/shared/directives/tax-session24-warning-timer.directive';
import { DialogService } from '@app/shared/services';
import { SideBarComponent } from '@app/shared/components/side-bar/side-bar.component';
import { RightBarComponent } from '@app/shared/components/right-bar/right-bar.component';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { SalesDialogComponent } from '@app/shared/components/sales-dialog/sales-dialog.component';
import { SubscriptionDialogComponent } from '@app/shared/components/subscription-dialog/subscription-dialog.component';
import { KeyboardShortcutDialogComponent } from '@app/shared/components/keyboard-shortcut-dialog/keyboard-shortcut-dialog.component';
import { FilterPipe } from '@app/shared/pipes/filter.pipe';
import { titleFilterPipe } from '@app/shared/pipes/titlefilter.pipe';
import { TrainingComponent } from '@app/shared/components/training/training.component';
import { GetTimeInMinutesAndSecondsPipe } from '@app/shared/pipes/get-time-in-min-seconds.pipe';
import { SafeHtml } from '@app/shared/pipes/safe-html.pipe';
import { InstancePreviewSessionComponent } from '@app/shared/components/instance-preview-session/instance-preview-session.component';
import { GridTemplateRendererComponent } from '@app/shared/components/grid-template-renderer/grid-template-renderer.component';
import { GenerateCustomerIdComponent } from '@app/shared/components/generate-customer-id/generate-customer-id.component';
import { UpdatedtermsComponent } from '@app/shared/components/updatedterms/updatedterms.component';
import { RatingsConfirmationComponent } from '@app/ratings/dialog/ratings-confirmation/ratings-confirmation.component';
import { ReleasePrintingDetailsComponent } from './components/release-printing-details/release-printing-details.component';
import { ReleaseStateDetailsWithStateOnlyComponent } from './components/release-state-details-with-state-only/release-state-details-with-state-only.component';
import { CloseConfirmationComponent } from './components/close-confirmation/close-confirmation.component';
import { ApprovedStatesEfileListComponent } from './components/approved-states-efile-list/approved-states-efile-list.component';
import { NewFeatureUpdateComponent } from './components/new-feature-update/new-feature-update.component';
import { TextMessageDialogComponent } from './components/text-message-dialog/text-message-dialog.component';
import { ExportDialogComponent } from '@app/efile-center/dialogs/export-dialog/export-dialog.component';
import { SignaturecaptureComponent } from '@app/signature/dialogs/signature-capture/signature-capture.component';
import { AppointmentReminderComponent } from './components/appointment-reminder/appointment-reminder.component';

// mask module default config
export const maskingOptions: Partial<IConfig> | (() => Partial<IConfig>) = {
  showMaskTyped: true,
  dropSpecialCharacters: false
};

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    NotifyDialogComponent,
    NavigatorUserInstructionComponent,
    PrivilegesInfoComponent,
    ToastContainerComponent,
    TimeOutWarningComponent,
    TaxSession24hoursWarningComponent,
    TaxIdleDirective,
    TaxSession24Directive,
    TaxSession24WarningTimerDirective,
    HeaderComponent,
    RightBarComponent,
    SideBarComponent,
    SalesDialogComponent,
    SubscriptionDialogComponent,
    KeyboardShortcutDialogComponent,
    FilterPipe,
    TrainingComponent,
    GetTimeInMinutesAndSecondsPipe,
    GridTemplateRendererComponent,
    InstancePreviewSessionComponent,
    GenerateCustomerIdComponent,
    UpdatedtermsComponent,
    RatingsConfirmationComponent,
    ReleaseStateDetailsWithStateOnlyComponent,
    ReleasePrintingDetailsComponent,
    CloseConfirmationComponent,
    SafeHtml,
    ApprovedStatesEfileListComponent,
    titleFilterPipe,
    NewFeatureUpdateComponent,
    TextMessageDialogComponent,
    SignaturecaptureComponent,
    ExportDialogComponent,
    AppointmentReminderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxQRCodeModule,
    PerfectScrollbarModule,
    NgxMaskModule.forRoot(maskingOptions)
  ],
  entryComponents: [
    ConfirmDialogComponent,
    NotifyDialogComponent,
    NavigatorUserInstructionComponent,
    PrivilegesInfoComponent,
    SalesDialogComponent,
    SubscriptionDialogComponent,
    KeyboardShortcutDialogComponent,
    TimeOutWarningComponent,
    GridTemplateRendererComponent,
    TaxSession24hoursWarningComponent,
    GenerateCustomerIdComponent,
    UpdatedtermsComponent,
    RatingsConfirmationComponent,
    ReleaseStateDetailsWithStateOnlyComponent,
    ReleasePrintingDetailsComponent,
    CloseConfirmationComponent,
    NewFeatureUpdateComponent,
    TextMessageDialogComponent,
    SignaturecaptureComponent,
    ExportDialogComponent,
    AppointmentReminderComponent
  ],
  providers: [
    DialogService,
    PdfMakeWrapper,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ToastContainerComponent,
    TaxIdleDirective,
    TaxSession24Directive,
    TaxSession24WarningTimerDirective,
    HeaderComponent,
    RightBarComponent,
    SideBarComponent,
    NgbModule,
    GetTimeInMinutesAndSecondsPipe,
    RatingsConfirmationComponent,
    NgxMaskModule,
    SafeHtml,
    ApprovedStatesEfileListComponent,
    FilterPipe,
    AppointmentReminderComponent
  ]
})
export class SharedModule { }
