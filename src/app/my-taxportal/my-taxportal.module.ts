import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyTaxportalRoutingModule } from './my-taxportal-routing.module';
import { MyTaxportalSettingsComponent } from './my-taxportal-settings/my-taxportal-settings.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { EmailTemplatesComponent } from './components/email-templates/email-templates.component';
import { ClientQuestionFormListComponent } from './components/client-question-form-list/client-question-form-list.component';
import { MyTaxportalService } from "./my-taxportal.service";
import { ImageCropperComponent } from './dialogs/image-cropper/image-cropper.component';
import { DialogService } from '@app/shared/services';
import { PreviewMailComponent } from './dialogs/preview-mail/preview-mail.component';
import { ManageInvitedClientsComponent } from './manage-invited-clients/manage-invited-clients.component';
import { CoreModule } from '@app/core/core.module';
import { InvitationLinkComponent } from './dialogs/invitation-link/invitation-link.component';
import { ResendInvitationEmailComponent } from './dialogs/resend-invitation-email/resend-invitation-email.component';
import { ResendInvitationSmsComponent } from './dialogs/resend-invitation-sms/resend-invitation-sms.component';
import { ChangeSsnComponent } from './dialogs/change-ssn/change-ssn.component';
import { SharedModule } from '@app/shared/shared.module';
import { InviteClientsComponent } from './invite-clients/invite-clients.component';
import { ClientquestionformComponent } from './dialogs/clientquestionform/clientquestionform.component';
import { SelectClientsComponent } from './components/select-clients/select-clients.component';
import { ClientListComponent } from './dialogs/client-list/client-list.component';
import { ClientDetailComponent } from './dialogs/client-detail/client-detail.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { ClientQuestionOutlineComponent } from './dialogs/client-question-outline/client-question-outline.component';
import { InviteClientsMailDetailComponent } from './components/invite-clients-mail-detail/invite-clients-mail-detail.component';
import { InviteClientQuestionSectionComponent } from './components/invite-client-question-section/invite-client-question-section.component';
import { SelectQuestionSetComponent } from './dialogs/select-question-set/select-question-set.component';
import { AnswerHistoryComponent } from './dialogs/answer-history/answer-history.component';


@NgModule({
  declarations: [
    MyTaxportalSettingsComponent,
    CompanyDetailsComponent,
    EmailTemplatesComponent,
    ClientQuestionFormListComponent,
    ImageCropperComponent,
    PreviewMailComponent,
    ManageInvitedClientsComponent,
    InvitationLinkComponent,
    ResendInvitationEmailComponent,
    ResendInvitationSmsComponent,
    ChangeSsnComponent,
    InviteClientsComponent,
    ClientquestionformComponent,
    SelectClientsComponent,
    ClientQuestionOutlineComponent,
    ClientListComponent,
    ClientDetailComponent,
    InviteClientsMailDetailComponent,
    InviteClientQuestionSectionComponent,
    SelectQuestionSetComponent,
    AnswerHistoryComponent
  ],
  imports: [
    ImageCropperModule,
    QuillModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MyTaxportalRoutingModule,
    SortablejsModule
  ],
  providers: [
    DialogService,
    MyTaxportalService
  ],
  entryComponents: [
    ImageCropperComponent,
    PreviewMailComponent,
    InvitationLinkComponent,
    ResendInvitationEmailComponent,
    ResendInvitationSmsComponent,
    ChangeSsnComponent,
    ClientQuestionOutlineComponent,
    ClientListComponent,
    ClientDetailComponent,
    SelectQuestionSetComponent,
    AnswerHistoryComponent
  ]
})
export class MyTaxportalModule { }
