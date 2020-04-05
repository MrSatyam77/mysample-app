// External Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgSelectModule } from '@ng-select/ng-select';


// Internal Imports
import { OfficeOverviewComponent } from '@app/office/office-overview/office-overview.component';
import { OfficeRoutingModule } from '@app/office/office-routing.module';
import { OfficeEditingComponent } from '@app/office/components/office-editing/office-editing.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserDetailComponent } from '@app/office/components/user-detail/user-detail.component';
import { UserEditingComponent } from '@app/office/components/user-editing/user-editing.component';
import { OfficeDetailComponent } from '@app/office/components/office-detail/office-detail.component';
import { ContractContactDetailComponent } from '@app/office/components/contract-contact-detail/contract-contact-detail.component';
import { ContractContactEditingComponent } from '@app/office/components/contract-contact-editing/contract-contact-editing.component';
import { LicenseOwnerDetailComponent } from '@app/office/components/license-owner-detail/license-owner-detail.component';
import { LicenseOwnerEditingComponent } from '@app/office/components/license-owner-editing/license-owner-editing.component';
import { OfficeAdministratorDetailComponent } from '@app/office/components/office-administrator-detail/office-administrator-detail.component';
import { OfficeAdministratorEditingComponent } from '@app/office/components/office-administrator-editing/office-administrator-editing.component';
import { ServiceBeureauDetailComponent } from '@app/office/components/service-beureau-detail/service-beureau-detail.component';
import { ServiceBeureauEditingComponent } from '@app/office/components/service-beureau-editing/service-beureau-editing.component';
import { PhoneVerificationComponent } from '@app/office/dialogs/phone-verification/phone-verification.component';
import { EmailVerificationComponent } from '@app/office/dialogs/email-verification/email-verification.component';
import { ChangePasswordComponent } from '@app/office/dialogs/change-password/change-password.component';
import { SetupConfirmComponent } from '@app/office/dialogs/setup-confirm/setup-confirm.component';
import { VerificationQuestionsComponent } from '@app/office/dialogs/verification-questions/verification-questions.component';
import { UploadEfinLetterComponent } from '@app/office/dialogs/upload-efin-letter/upload-efin-letter.component';
import { SetupAlertComponent } from '@app/office/dialogs/setup-alert/setup-alert.component';
import { VerificationFailedComponent } from '@app/office/dialogs/verification-failed/verification-failed.component';
import { VerificationMissingInfoComponent } from '@app/office/dialogs/verification-missing-info/verification-missing-info/verification-missing-info.component';
import { EfinDetailComponent } from '@app/office/components/efin-detail/efin-detail.component';
import { EfinEditingComponent } from '@app/office/components/efin-editing/efin-editing.component';
import { OfficeSettingsComponent } from '@app/office/office-settings/office-settings.component';
import { OfficeChangeComponent } from './office-change/office-change.component';

@NgModule({
  declarations: [
    OfficeOverviewComponent,
    OfficeEditingComponent,
    UserDetailComponent,
    UserEditingComponent,
    OfficeDetailComponent,
    ContractContactDetailComponent,
    ContractContactEditingComponent,
    LicenseOwnerDetailComponent,
    LicenseOwnerEditingComponent,
    OfficeAdministratorDetailComponent,
    OfficeAdministratorEditingComponent,
    ServiceBeureauDetailComponent,
    ServiceBeureauEditingComponent,
    PhoneVerificationComponent,
    EmailVerificationComponent,
    SetupAlertComponent,
    SetupConfirmComponent,
    UploadEfinLetterComponent,
    VerificationFailedComponent,
    VerificationQuestionsComponent,
    ChangePasswordComponent,
    EfinDetailComponent,
    EfinEditingComponent,
    VerificationMissingInfoComponent,
    OfficeSettingsComponent,
    OfficeChangeComponent
  ],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    SharedModule,
    NgxUploaderModule,
    NgSelectModule
  ],
  entryComponents: [
    PhoneVerificationComponent,
    EmailVerificationComponent,
    SetupAlertComponent,
    SetupConfirmComponent,
    UploadEfinLetterComponent,
    VerificationFailedComponent,
    VerificationQuestionsComponent,
    ChangePasswordComponent,
    VerificationMissingInfoComponent
  ],
  providers: [
  ]
})
export class OfficeModule { }
