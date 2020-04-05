import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { NgxUploaderModule } from 'ngx-uploader';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ManageRoutingModule } from './manage-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '@app/shared/shared.module';
import { EmailSupportComponent } from './email-support/email-support.component';


@NgModule({
  declarations: [ChangePasswordComponent, EmailSupportComponent],
  imports: [
    CommonModule,
    SharedModule,
    QuillModule.forRoot(),
    NgxUploaderModule,
    PerfectScrollbarModule,
    ManageRoutingModule
  ]
})
export class ManageModule { }
