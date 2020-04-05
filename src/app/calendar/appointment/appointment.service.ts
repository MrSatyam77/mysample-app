import { Injectable } from '@angular/core';

import { CommonAPIService } from "@app/shared/services/common-api.service";
import { UserService } from "@app/shared/services/user.service";
import { APINAME } from '../calendar.constants';
import { promise } from 'protractor';

@Injectable()
export class AppointmentService {
  public dateMode;
  public startDate;
  /** Private variable */
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
    { displayText: 'Please Select', value: '' },
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
    private _commonAPI: CommonAPIService,
    private _userService: UserService) { }

  /** Get appointment send list */
  public getAppointmentSendList() {
    return this.sendList;
  }

  /** Get Remind me list */
  public getRemindMeList() {
    return this.remindMeList;
  }

  /** Set start date */
  setStartDate(date) {
    if (this.dateMode) {
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
    }
  }

  /** Grt User list */
  public getUserList() {
    return this._commonAPI.getObservableResponse({ apiName: APINAME.USERS_LIST, parameterObject: null });
  }

  /** Get Recent return list */
  public getRecentReturns() {
    return this._commonAPI.getObservableResponse({ apiName: APINAME.RECENT_RETURN_LIST, parameterObject: null });
  }

  /** Create appointment */
  public create(data: any) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.CREATE_APPOINTMENT, parameterObject: { 'data': data } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

   /** save(update) appointment */
   public save(data: any) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.SAVE_EVENT, parameterObject: { 'data': data } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /** remove appointment */
  public remove(data: any) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.REMOVE_APPOINTMENT, parameterObject: { 'data': data } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /** Open appointment */
  public Open(id: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.OPEN_APPOINTMENT, parameterObject: { 'data': { 'id': id } } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
  
  /** Set time interval */
  private setTimeInterval(date) {
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
}
