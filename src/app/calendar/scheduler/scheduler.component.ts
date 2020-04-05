/** External Import */
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import timegrid from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as moment from "moment";
/** Internal Import */
// import { SchedulerService } from "./scheduler.service";
import { IScheduler } from '@app/calendar/calendar';
import { MessageService, BasketService, UserService } from '@app/shared/services';
import { CalendarService } from '@app/calendar/calendar.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  // providers: [SchedulerService]
})
export class SchedulerComponent implements OnInit {
  /** Public Variable */
  calendarPlugins = [interactionPlugin, dayGridPlugin, timegrid];
  defaultView = "dayGridMonth";
  defaultDate = new Date();
  calendarMode: any;
  CalenderHeader: any = {
    right: 'title ,prev,next,today',
    left: 'timeGridDay,timeGridWeek,dayGridMonth,'
  };
  CalenderHeaderButtonText: any = {
    today: "Today",
    day: "Day",
    week: "Week",
    month: "Month"
  };
  firstRefreshStart: boolean;
  events: IScheduler[];
  privileges: any;

  constructor(
    private calendarService: CalendarService,
    private messageService: MessageService,
    private basketService: BasketService,
    private userService: UserService,
    private router: Router
  ) { }

  //Event click
  handelEventClick(info) {
    this.router.navigate(["calendar/appointment", "edit", info.event.id]);
  }

  //Date cell click
  handelDateClick(event) {
    let date = event.date.setTime(new Date().getTime());
    date = this.calendarService.setTimeInterval(new Date(date));
    this.basketService.pushItem("APPOINTMENT_DATE", date);
    this.router.navigate(["calendar/appointment", "edit"]);
  }

  /** Drop event */
  handelDropEvent(info) {
    this.saveEvent(info);
  }

  /** Resize event */
  handelResizeEvent(info) {
    this.saveEvent(info);
  }

  /** Navigate New Appointment */
  newAppointment() {
    this.router.navigate(["calendar/appointment", "edit"]);
  }

  backToHomeScreen() { }

  manuallyRefreshTraining() { }
  /** Init */
  ngOnInit() {
    this.calendarMode = this.basketService.popItem("calDateMode");
    let mode: any = this.calendarService.setDateByCalenderMode(this.calendarMode);
    if (mode) {
      this.defaultView = mode.viewMode;
      this.defaultDate = mode.viewDate;
    }
    this.privileges = { CAN_CREATE_CALENDAR: this.userService.can("CAN_CREATE_CALENDAR") };
    this.getEventList();
  }

  /** Get Event List */
  private getEventList() {
    this.calendarService.getEventList().then((response: any) => {
      this.events = response;
    });
  }

  /** Save data event */
  private saveEvent(info) {
    let event = info.event.extendedProps;
    var eventData = {
      id: info.event.id,
      subject: event.subject,
      description: event.description,
      participants: event.participants,
      start: info.event.start.toUTCString(),
      end: info.event.start.toUTCString(),
      color: info.event.backgroundColor,
      textColor: info.event.textColor,
      isPrivate: event.isPrivate,
      remindMeBefore: event.remindMeBefore ? event.remindMeBefore : undefined,
      alertTime: event.alertTime.toUTCString(),
      snoozeCount: event.snoozeCount ? event.snoozeCount : 0,
    };
    //Save data
    this.calendarService.saveEvent(eventData).then((response: any) => {
      this.messageService.showMessage("Updated successfully.", "success");
    });
  }
}
