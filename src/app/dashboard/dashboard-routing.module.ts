import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { CanDeactivateGuard } from '@app/shared/guards/canDeactivate.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: 'settings/:rightModel',
        component: DashboardComponent,
        canActivate: [AuthenticationGuard],
        canDeactivate: [CanDeactivateGuard],
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: 'settings/:rightModel/:locationId',
        component: DashboardComponent,
        canActivate: [AuthenticationGuard],
        canDeactivate: [CanDeactivateGuard],
        data: { access: { requiredAuthentication: true } }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [],
    declarations: [],
})
export class DashboardRoutingModule { }