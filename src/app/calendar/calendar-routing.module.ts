/** External import */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/** Internal import */
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { SchedulerComponent } from "./scheduler/scheduler.component";
import { AppointmentComponent } from "./appointment/appointment.component";

const routes: Routes = [
    {
        path: "",
        component: SchedulerComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true, privileges: ['CAN_LIST_CALENDAR'] } }
    },
    {
        path: "appointment/edit",
        component: AppointmentComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true, privileges: ['CAN_CREATE_CALENDAR'] } }
    },
    {
        path: "appointment/edit/:id",
        component: AppointmentComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true, privileges: ['CAN_OPEN_CALENDAR', 'CAN_SAVE_CALENDAR', 'CAN_REMOVE_CALENDAR'] } }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CalendarRoutingModule { }
