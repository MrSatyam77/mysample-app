// External Imports
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Internal Imports
import { OfficeOverviewComponent } from '@app/office/office-overview/office-overview.component';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { OfficeSettingsComponent } from '@app/office/office-settings/office-settings.component';
import { OfficeChangeComponent } from './office-change/office-change.component';

const officeRoutes: Routes = [
    {
        path: 'overview',
        component: OfficeOverviewComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true, privileges: ["CAN_LIST_USER", "CAN_LIST_LOCATION"] } }
    },
    {
        path: 'selection',
        component: OfficeChangeComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: 'selection/:mode',
        component: OfficeChangeComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: 'settings',
        component: OfficeSettingsComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    }
]

@NgModule({
    imports: [RouterModule.forChild(officeRoutes)],
    exports: [RouterModule]
})

export class OfficeRoutingModule { }