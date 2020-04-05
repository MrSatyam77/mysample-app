//External Imports 
import { Injectable, Injector } from '@angular/core';

//Internal Imports
import { CommonAPIService } from "@app/shared/services/common-api.service";
import { APINAME } from '@app/calendar/calendar.constants';
import { UtilityService } from '@app/shared/services/utility.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { AppointmentReminderComponent } from '@app/shared/components/appointment-reminder/appointment-reminder.component';

@Injectable({
  providedIn: 'root'
})

export class CalendarService {
  /** Private variable */
  private color = "#34495e";
  private privateColor = "#0FA5B0";
  private textColor = "#fff";

  /** public variable */
  public dateMode;
  public startDate;
  public endDate;
  public calendar = { "view": "" };
  public selectedDate = undefined;
  public enableRevisit = false;
  public appointmentList = [];
  public appointmentsToRemind = [];
  public scheduleReminderTime;
  public isSnoozeInProcess = false;

  private sendList = [{
    "value": "other_participants",
    "name": "Text to Other Participants"
  },
  {
    "value": "text_contact",
    "name": "Text to Contact"
  },
  {
    "value": "message_contact",
    "name": "Text Message To Contact"
  },
  {
    "value": "text_originator",
    "name": "Text to Originator"
  },
  {
    "value": "mytax_contact",
    "name": "MYTAXPortal invite to Contact"
  },
  {
    "value": "notifications",
    "name": "Appointment Notification"
  }];

  private remindMeList = [
    { displayText: 'Please Select', value: 0 },
    { displayText: 'At Time Of Appointment', value: 0 },
    { displayText: '5 Minutes Before', value: 5 },
    { displayText: '15 Minutes Before', value: 15 },
    { displayText: '30 Minutes Before', value: 30 },
    { displayText: '1 Hour Before', value: 60 },
    { displayText: '2 Hours Before', value: 120 },
    { displayText: '1 Day Before', value: 1440 },
    { displayText: '2 Days Before', value: 2880 },
    { displayText: '1 Week Before', value: 10080 },
  ];

  constructor(
    private commonApiService: CommonAPIService,
    private _injector: Injector) { }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Get Event List
     * @memberof appointmentService
     */

  public getEventList() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_EVENT_LIST }).then((response) => {
        if (response.data && response.data.length > 0) {
          response.data.forEach(element => {
            element.title = element.subject;
            element.start = new Date(element.start);
            element.end = new Date(element.end);
            if (element.isPrivate) {
              element.backgroundColor = this.privateColor;
            } else {
              element.backgroundColor = this.color;
            }
            element.color = this.textColor;
            element.alertTime = element.alertTime ? new Date(element.alertTime) : undefined;
          });
          resolve(response.data);
          this.appointmentList = response.data;
          this.initAppointmentReminder();
        }
        else { resolve([]); }
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Save Event
     * @memberof appointmentService
     */

  public saveEvent(data) {
    const self = this;
    this.updateAlertTime(data);
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.SAVE_EVENT, parameterObject: { 'data': data } }).then((response) => {
        if (response.data) {
          resolve(response.data)
        }
        else { resolve([]); }
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Get appointment send list 
     * @memberof appointmentService
     */

  public getAppointmentSendList() {
    return this.sendList;
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Get Remind me list
     * @memberof appointmentService
     */

  public getRemindMeList() {
    return this.remindMeList;
  }


  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Get User list
     * @memberof appointmentService
     */

  public getUserList() {
    return this.commonApiService.getObservableResponse({ apiName: APINAME.USERS_LIST, parameterObject: null });
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Get Recent return list
     * @memberof appointmentService
     */

  public getRecentReturns() {
    return this.commonApiService.getObservableResponse({ apiName: APINAME.RECENT_RETURN_LIST, parameterObject: null });
  }

  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Create appointment 
     * @memberof appointmentService
     */

  public create(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.CREATE_APPOINTMENT, parameterObject: { 'data': data } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description  save(update) appointment 
     * @memberof appointmentService
     */

  public save(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.SAVE_EVENT, parameterObject: { 'data': data } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description remove appointment
     * @memberof appointmentService
     */

  public remove(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.REMOVE_APPOINTMENT, parameterObject: { 'data': data } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description Open appointment 
     * @memberof appointmentService
     */

  public Open(id: string) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.OPEN_APPOINTMENT, parameterObject: { 'data': { 'id': id } } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use init appointment 
     * @memberof appointmentService
     */
  private initAppointmentReminder() {
    if (this.appointmentList) {
      this.appointmentsToRemind = this.updateAppointmentToRemind(this.appointmentList);
    }
    if (this.appointmentsToRemind.length > 0) {
      //check undefined before canceling
      if (this.scheduleReminderTime) {
        clearTimeout(this.scheduleReminderTime);
        this.scheduleReminderTime = undefined;
      }
      //variable that hold the time which will be used to hold the code for that period of time to get executed]

      let nextReminderTime = this.appointmentsToRemind[0].alertTime.getTime() - new Date().getTime();

      //If alert time is in future but not more then after 12 hours
      if (nextReminderTime > -1 && nextReminderTime < 43200000) {
        this.startAppointmentReminder(nextReminderTime);
      } else if (nextReminderTime <= -1 && nextReminderTime > -60000) { //If alert time was in past 60 seconds
        this.startAppointmentReminder(0);
      }
    } else {//cancel timeout in else
      if (this.scheduleReminderTime) {
        clearTimeout(this.scheduleReminderTime);
        this.scheduleReminderTime = undefined;
      }
    }
    this.isSnoozeInProcess = false;
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use to update appointment reminder
     * @memberof appointmentService
     */
  private updateAppointmentToRemind(appointmentList) {
    let utilityService = this._injector.get(UtilityService);
    return utilityService.sortByProperty(
      appointmentList.filter((appointmentObj) => {
        if ((appointmentObj.alertTime) && appointmentObj.alertTime >= new Date(new Date().setSeconds(0))) {
          return true;
        }
      }), 'alertTime');
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use reminde appointment 
     * @memberof appointmentService
     */
  public startAppointmentReminder(nextReminderTime) {
    let appointments = this.appointmentsToRemind.filter((appointmentObj) => {
      return new Date(appointmentObj.alertTime) >= new Date(new Date(this.appointmentsToRemind[0].alertTime).setSeconds(0)) && new Date(appointmentObj.alertTime) <= new Date(new Date(this.appointmentsToRemind[0].alertTime).setSeconds(59));
    })
    setTimeout(() => {
      let dialogService = this._injector.get(DialogService);
      let dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
      return new Promise((resolve, reject) => {
        let dialog = dialogService.custom(AppointmentReminderComponent, { appointments: appointments }, dialogConfiguration);
        dialog.result.then((result) => {
          if (result.snoozeAppointmentList) {
            result.snoozeAppointmentList.forEach(appointmentObj => {
              let getAppointment: any = this.appointmentList.find((obj) => { return obj.id === appointmentObj.id });
              if (getAppointment) {
                getAppointment.alertTime = new Date(appointmentObj.alertTime);
                getAppointment.snoozeCount = appointmentObj.snoozeCount;
              }
            });
          }
          this.initAppointmentReminder();
          resolve(result);
          (error) => {
            reject(error);
          }
        });
      });
    }, nextReminderTime);
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use update alert time 
     * @memberof appointmentService
     */

  private updateAlertTime(appointment) {
    let getAppointment: any = this.appointmentList.find((obj) => { return obj.id === appointment.id });
    if (getAppointment) {
      getAppointment.alertTime = new Date(appointment.alertTime);
      getAppointment.snoozeCount = appointment.snoozeCount;
      //update (sync) events
      this.initAppointmentReminder();
    }
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use setStart date 
     * @memberof appointmentService
     */

  public setStartDate(date?: any) {
    if (!this.dateMode) {
      this.dateMode = "current";
    }
    switch (this.dateMode.toLowerCase()) {
      case "current":
        // We want minutes to be in 15minutes interval gap IF date-time is current date-time
        date = new Date();
        date = this.setTimeInterval(date);
        this.startDate = date;
        break;
      case "specific":
        this.startDate = date ? new Date(date) : new Date();
        break;
      default:
        this.setStartDate(date);
        break;
    }
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use setTime interval 
     * @memberof appointmentService
     */

  public setTimeInterval(date) {
    var minute = date.getMinutes();
    minute = parseInt(minute);

    if (minute >= 0 && minute <= 15) {
      minute = 15;
    } else if (minute > 15 && minute <= 30) {
      minute = 30;
    } else if (minute > 30 && minute <= 45) {
      minute = 45;
    } else if (minute > 45 && minute <= 60) {
      minute = 0;
      date.setHours(date.getHours() + 1);
    }
    date.setMinutes(minute);
    return date;
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use getStart date 
     * @memberof appointmentService
     */
  public getStartDate() {
    if (this.endDate) {
      // this.setEndDate(date);
      this.setEndDate();
    }
    return this.endDate;
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use to setEnd date 
     * @memberof appointmentService
     */
  public setEndDate(date?: any) {
    if (this.dateMode) {
      this.dateMode = "current";
    }
    switch (this.dateMode.toLowerCase()) {
      case "current":
        // We want minutes to be in 15minutes interval gap IF date-time is current date-time
        this.endDate = date;
        break;
      case "specific":
        this.startDate = date ? new Date(date) : new Date();
        break;
      default:
        this.setEndDate(date);
        break;
    }
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description this function is use to getEnd date 
     * @memberof appointmentService
     */
  public getEndDate() {
    if (this.endDate) {
      this.setEndDate();
    }
    return this.endDate;
  }
  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description initSnoozer 
     * @memberof appointmentService
     */
  public initSnoozer() {
    //If snooze initialization is not already in process
    if (this.isSnoozeInProcess == false) {
      //Set isSnoozeInProcess true
      this.isSnoozeInProcess = true;
      //this list method then invoke snooze method
      this.getEventList();
    }
  };

  /**
   * @author Hitesh Soni
   * @param mode 
   */
  public setDateByCalenderMode(calendarMode: string) {
    let date = new Date();
    let obj;
    switch (calendarMode) {
      case "tomorrow":
        obj = { viewDate: date.setDate(date.getDate() + 1), viewMode: "timeGridDay" }
        break;
      default:
        break;
    }
    return obj;
  }
}
