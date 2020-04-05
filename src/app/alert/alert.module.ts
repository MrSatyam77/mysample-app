import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Internal Exports
import { AllowedFeatureComponent } from '@app/alert/allowed-feature/allowed-feature.component';
import { AlertRoutingModule } from '@app/alert/alert-routing.module';
import { PrivilegesInfoComponent1 } from '@app/alert/privileges-info/privileges-info.component';
import { LicenseInfoComponent } from './license-info/license-info.component';



@NgModule({
  declarations: [
    AllowedFeatureComponent,
    PrivilegesInfoComponent1,
    LicenseInfoComponent
  ],
  imports: [
    CommonModule,
    AlertRoutingModule
  ],
  exports: []
})
export class AlertModule { }
