// External Imports
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Internal Imports
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { AllowedFeatureComponent } from '@app/alert/allowed-feature/allowed-feature.component';
import {PrivilegesInfoComponent1} from '@app/alert/privileges-info/privileges-info.component';
import { LicenseInfoComponent } from '@app/alert/license-info/license-info.component';

const alertRoutes: Routes = [
    {
        path: 'allowedFeature',
        component: AllowedFeatureComponent,
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: 'privilegesInfo',
        component: PrivilegesInfoComponent1,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: 'licenseInfo',
        component: LicenseInfoComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    }
]

@NgModule({
    imports: [RouterModule.forChild(alertRoutes)],
    exports: [RouterModule]
})

export class AlertRoutingModule { }