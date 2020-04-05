/** External Import */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from "@fullcalendar/angular";
/** Internal Import */
import { SchedulerComponent } from './scheduler/scheduler.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { DialogService } from '@app/shared/services';

@NgModule({
  declarations: [SchedulerComponent, AppointmentComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    FullCalendarModule,
    CalendarRoutingModule
  ],
  providers: [
    DialogService
  ]
})
export class CalendarModule { }
