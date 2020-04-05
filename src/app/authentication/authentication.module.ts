// External Imports
import { NgModule } from '@angular/core';
import { NgxMaskModule,IConfig } from 'ngx-mask'

// Internal Imports 
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthenticationRoutingModule } from '@app/authentication/authentication-routing.module';
import { SharedModule } from "@app/shared/shared.module";
import { NewsComponent } from './components/news/news.component';
import { QuicktipsComponent } from './components/quicktips/quicktips.component';
import { RegistrationComponent } from './registration/registration.component';
import { TermsAndPolicyDialogComponent } from './dialogs/terms-and-policy-dialog/terms-and-policy-dialog.component';
import { PrivacyPolicyDialogComponent } from './dialogs/privacy-policy-dialog/privacy-policy-dialog.component';

// mask module default config
export const maskingOptions: Partial<IConfig> | (() => Partial<IConfig>) = {
  showMaskTyped: true,
  dropSpecialCharacters: false
};

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegistrationComponent,
    TermsAndPolicyDialogComponent,
    PrivacyPolicyDialogComponent,
    NewsComponent,
    QuicktipsComponent
  ],
  imports: [
    NgxMaskModule.forRoot(maskingOptions),
    SharedModule,
    AuthenticationRoutingModule
  ],
  entryComponents: [
    TermsAndPolicyDialogComponent,
    PrivacyPolicyDialogComponent,
  ]
})
export class AuthenticationModule { }
