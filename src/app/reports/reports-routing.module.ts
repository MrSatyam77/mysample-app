// Extrenal Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Internal Imports
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { CustomReportEditComponent } from '@app/reports/custom-report-edit/custom-report-edit.component';
import { CustomReportListComponent } from '@app/reports/custom-report-list/custom-report-list.component';
import { ViewReportComponent } from '@app/reports/view-report/view-report.component';

const reportRoutes: Routes = [
    {
        path: 'view/:reportId',
        component: ViewReportComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: 'custom/edit/:reportId',
        component: CustomReportEditComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true, privileges: ["IS_ADMINISTRATOR"] } }
    },
    {
        path: 'list',
        component: CustomReportListComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    }
]

@NgModule({
    imports: [RouterModule.forChild(reportRoutes)],
    exports: [RouterModule]
})

export class ReportsRoutingModule { }
