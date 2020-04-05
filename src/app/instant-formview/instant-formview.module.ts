// External Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

// Internal Imports
import { InstantFormviewRoutingModule } from './instant-formview-routing.module';
import { TrustedDeviceListComponent } from './trusted-device-list/trusted-device-list.component';
import { AuthorizeDeviceListComponent } from './authorize-device-list/authorize-device-list.component';
import { SharedModule } from "@app/shared/shared.module";
import { TrustedDeviceListConnectComponent } from './dialogs/trusted-device-list-connect/trusted-device-list-connect.component';
import { DialogService } from '@app/shared/services';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { DeviceListComponent } from './device-list/device-list.component';
import {PriceListPreviewComponent} from './price-list-preview/price-list-preview.component'
@NgModule({
  declarations: [
    DeviceListComponent,
    TrustedDeviceListComponent,
    AuthorizeDeviceListComponent,
    TrustedDeviceListConnectComponent,
    FormPreviewComponent,
    PriceListPreviewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InstantFormviewRoutingModule,
    AgGridModule.withComponents([]),
  ],
  providers: [DialogService],
  entryComponents: [TrustedDeviceListConnectComponent, PriceListPreviewComponent]
})
export class InstantFormviewModule {
}
