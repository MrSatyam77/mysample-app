//External Imports
import { NgModule } from '@angular/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';


//Internal Imports
import { SignatureRoutingModule } from '@app/signature/signature-routing.module';
import { DeviceListComponent } from '@app/signature/signature-device-list/signature-device-list.component';
import {DeviceRegistrationComponent} from '@app/signature/dialogs/device-registration/device-registration.component';
import { CoreModule } from '@app/core/core.module';
import {DialogService} from '@app/shared/services/dialog.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [DeviceListComponent,DeviceRegistrationComponent,],
  imports: [
    CoreModule,
    NgxQRCodeModule,
    SharedModule,
    SignatureRoutingModule
  ],
  providers: [DialogService],
  entryComponents: [DeviceRegistrationComponent]
})
export class SignatureModule { }
